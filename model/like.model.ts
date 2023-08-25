import mongoose from 'mongoose';

const LikeModel = mongoose.model(
    'Like',
    new mongoose.Schema({
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        likedDate: {
            type: Date,
            default: Date.now
        }
    })
);

export default LikeModel;
