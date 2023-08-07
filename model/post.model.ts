import mongoose from 'mongoose';

const PostModel = mongoose.model(
    'Post',
    new mongoose.Schema({
        email: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        photoUrl: String,
        postedDate: Date,
        colorPalette: [String]
    })
);

export default PostModel;
