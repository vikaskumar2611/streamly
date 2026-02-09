import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        poll: {
            type: String,
            required: true,
        },
        options: [
            {
                text: { type: String, required: true },
                votes: { type: Number, default: 0 },
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        voters: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },

    { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
