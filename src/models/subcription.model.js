import mongoose, { Mongoose } from "mongoose"


const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)