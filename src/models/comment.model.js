import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const commentSchema = new mongoose.Schema({
    
})

export const Comment = mongoose.model("Comment", commentSchema)