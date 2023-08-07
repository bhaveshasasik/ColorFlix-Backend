import mongoose from 'mongoose';

const CommentModel = mongoose.model(
    'Comment',
    new mongoose.Schema({
        email: String,
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        postedDate: Date,
        context: String
    })
);

export default CommentModel;
