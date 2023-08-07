import mongoose from 'mongoose';

const UserModel = mongoose.model(
    'User',
    new mongoose.Schema({
        email: String,
        password: {
            type: String,
            select: false,
        },
        salt: {
            type: String,
            select: false,
        }, // salt for increasing security
        name: String,
        username: String,
        photoUrl: String // profile picture
    }),
);

export default UserModel;
