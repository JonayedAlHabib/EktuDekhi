const asyncHandler = (requestHandler) => {
    (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
}
export {asyncHandler}


// const asyncHandler = () => {}
// const asyncHandler = (function) => () => {}
// const asyncHandler = (funciton) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code).json({
//             success: false,
//             message: error.message
//         })
//     }
// }