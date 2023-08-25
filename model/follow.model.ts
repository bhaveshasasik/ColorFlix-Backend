import mongoose from 'mongoose';

const FollowModel = mongoose.model(
    'Follow',
    new mongoose.Schema({
        followed: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        following: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    })
);

export default FollowModel;
