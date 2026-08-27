import dotenv from "dotenv"
import connectDB from "./db/db.js";
dotenv.config({
    path: './env'
})

connectDB()

/*
import express from "express"
const app = express()

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.error("error", error)
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Error: ", error)
        throw error
    }
})()
    */