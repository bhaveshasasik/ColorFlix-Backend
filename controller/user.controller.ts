import { Request, Response } from 'express';
import User from '../model/user.model';

async function getInfo(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).select(['-_id', '-__v', '-refreshToken']);
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: 'Cannot get user info' });
    }
}

/*
    Only update NAME is available
*/
async function updateInfo(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        user.name = req.body.name;
        await user.save();

        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({ message: 'Cannot update user info' });
    }
}

const userCtrl = {
    getInfo,
    updateInfo
};

export default userCtrl;
