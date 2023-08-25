import { Request, Response } from 'express';
import Like from '../model/like.model';

async function likePost(req: Request, res: Response) {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;
        const foundLike = await Like.findOne({
            post: postId,
            user: userId
        })

        if (!foundLike) {
            const like = new Like({
                post: postId,
                user: userId
            });
            await like.save();
        }
        else {
            await foundLike.deleteOne();
        }

        return res.sendStatus(200);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

async function getAllLikeByPostId(req: Request, res: Response) {
    try {
        const postId = req.params.postId;
        const likeList = await Like.find({
            post: postId
        })
        return res.json(likeList);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

const likeCtrl = {
    likePost,
    getAllLikeByPostId
};

export default likeCtrl;
