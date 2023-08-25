import mongoose, { now } from 'mongoose';

const CommentModel = mongoose.model(
    'Comment',
    new mongoose.Schema({
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        postedDate: {
            type: Date,
            default: Date.now
        },
        context: String
    })
);

export default CommentModel;
