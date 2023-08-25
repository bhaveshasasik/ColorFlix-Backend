import mongoose from 'mongoose';

const PostModel = mongoose.model(
    'Post',
    new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        filename: String,
        photoUrl: String,
        caption: String,
        postedDate: {
            type: Date,
            default: Date.now
        },
        colorPalette: [String]
    })
);

export default PostModel;
