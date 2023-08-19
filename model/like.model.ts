import mongoose from 'mongoose';

const LikeModel = mongoose.model(
    'Like',
    new mongoose.Schema({
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        likedDate: Date
    })
);

export default LikeModel;
