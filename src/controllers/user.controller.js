import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    } catch (error) {
        console.error("Token generation error:", error)
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler (async (req, res) => {
    const {fullName, email, userName, password} = req.body
    console.log("Email: ", email);

    if([fullName, email, userName, password].some((field) => !field?.trim()))
    {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exits")
    }
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required. Send it as multipart/form-data using the field name 'avatar'.")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar)
        throw new ApiError(400, "Avatar upload failed")

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser)
        throw new ApiError(500, "Something went wrong while registering the user")

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler (async (req, res) => {

    const {userName, email, password} = req.body

    if(!userName || !email)
        throw new ApiError(400, "UserName and email is required")

    const user = await User.findOne({
        $or: [{userName}, {email}]
    })

    if(!user)
        throw new ApiError(404, "User does not exits")

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid)
        throw new ApiError(401, "Invalid credentials")


    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "User loggedIn successfully"
        )
    )

})

const logoutUser = asyncHandler (async (req, res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler (async (req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshTokenif

    if(!incomingRefreshToken)
        throw new ApiError(401, "Unauthorized request")

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken._id)
    
        if(!user)
            throw new ApiError(401, "Invalid refresh token")
    
        if(incomingRefreshToken !== user?.refreshToken)
            throw new ApiError(401, "Refresh Token is expired or used")
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = generateAccessTokenAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken,
                },
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changePassword = asyncHandler (async (req, res) =>{
    const {oldPassword, newPassword} = req.body

    const user = User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect)
        throw new ApiError(400, "Invalid Old Password")

    user.password = newPassword
    await user.save({validationBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed Successfully"))

})

const getCurrentUser = asyncHandler (async (req, res) =>{
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "User Fetched Successfully"
        )
    )
})

const updateAccountDetails = asyncHandler (async (req, res) =>{
    const {fullName, email} = req.body

    if(!fullName || !email)
        throw new ApiError(400, "All fields are required")

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new : true}
    ).select(-password)

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated Successfully"))
})

const updateUserAvatar = asyncHandler (async (req, res) =>{
    const avatarLocal = req.file?.path

    if(!avatarLocal)
        throw new ApiError(400, "Avatar file missing")

    const avatar = uploadOnCloudinary(avatarLocal)

    if(!avatar.url)
        throw new ApiError(400, "Error while file uploading")

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"))
})

const updateUserCoverImage = asyncHandler (async (req, res) =>{
    const coverImageLocal = req.file?.path

    if(!coverImageLocal)
        throw new ApiError(400, "Cover Image field missing")

    const coverImage = uploadOnCloudinary(coverImageLocal)

    if(!coverImage.url)
        throw new ApiError(400, "Error while file uploading")

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}