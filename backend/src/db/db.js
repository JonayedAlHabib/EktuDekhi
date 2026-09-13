import mongoose from "mongoose"
import {DB_NAME} from "../constant.js"

const connectDB = async ()=>{
    try {
        const mongoUri = process.env.MONGO_URI.replace(/\/+$/, "")
        const connectionInstance = await mongoose.connect(`${mongoUri}/${DB_NAME}`)
        console.log(`\n MongoDB Connected !! DB Host :${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("ERROR: ", error)
        process.exit(1)
    }
}

export default connectDB;