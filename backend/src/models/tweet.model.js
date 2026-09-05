import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const tweetSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    }
}, {timestamps: true})

tweetSchema.plugin(mongoosePaginate)

export const Tweet = mongoose.model("Tweet", tweetSchema)