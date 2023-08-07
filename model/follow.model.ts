import mongoose from 'mongoose';

const FollowModel = mongoose.model(
    'Follow',
    new mongoose.Schema({
        email: String,
        followedId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        followingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    })
);

export default FollowModel;
