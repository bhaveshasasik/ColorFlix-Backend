import { Request, Response } from 'express';
import Comment from '../model/comment.model';

async function createComment(req: Request, res: Response) {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;
        const context = req.body.context;

        const comment = new Comment({
            post: postId,
            user: userId,
            context: context
        });

        await comment.save();
        return res.sendStatus(200);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

async function getAllCommentByPostId(req: Request, res: Response) {
    try {
        const postId = req.params.postId;

        const comments = await Comment.find({
            post: postId
        })
            .select('-__v -post')
            .populate('user', 'name username');

        return res.json(comments);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

async function updateComment(req: Request, res: Response) {
    try {
        const commentId = req.params.commentId;
        const postId = req.params.postId;
        const comment = await Comment.findById(commentId);
        if (postId !== comment.post.toString()) {
            return res.status(400).json({
                'message': 'The comment does not belong to the post'
            })
        }

        comment.context = req.body.context;
        await comment.save();

        return res.sendStatus(200);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

async function deleteComment(req: Request, res: Response) {
    try {
        const commentId = req.params.commentId;
        const postId = req.params.postId;
        const comment = await Comment.findById(commentId);

        // Check the user's authority for this comment
        const userId = req.body.userId;
        if (userId !== comment.user.toString()) {
            return res.status(401).json({
                'message': 'You can\'t edit this comment'
            })
        }

        if (postId !== comment.post.toString()) {
            return res.status(400).json({
                'message': 'The comment does not belong to the post'
            })
        }

        await Comment.findByIdAndRemove(commentId);
        return res.sendStatus(200);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

const commentCtrl = {
    createComment,
    getAllCommentByPostId,
    updateComment,
    deleteComment
};

export default commentCtrl;
