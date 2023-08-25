import postCtrl from '../controller/post.controller';
import likeCtrl from '../controller/like.controller';
import commentCtrl from '../controller/comment.controller';

import auth from '../middleware/auth';
import express from "express";
import fileUpload from 'express-fileupload';

const router = express.Router();

router.route('/user/:userId')
    .get(postCtrl.getAllPostByUser);

router.route('/:postId/like')
    .get(likeCtrl.getAllLikeByPostId);


router.route('/:postId/comment')
    .get(commentCtrl.getAllCommentByPostId);

// The routes below requires token provided
router.use(auth.verifyToken);

router.route('/:postId')
    .get(postCtrl.getPostById)
    .delete(auth.verifyToken, postCtrl.deletePost)
    .put(auth.verifyToken, postCtrl.updatePost);

router.route('/')
    .post(fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/'
    }), postCtrl.createPost);

// Like feature
router.route('/:postId/like')
    .post(likeCtrl.likePost);

// Comment feature
router.route('/:postId/comment')
    .post(commentCtrl.createComment);

router.route('/:postId/comment/:commentId')
    .put(commentCtrl.updateComment)
    .delete(commentCtrl.deleteComment);

export default router;
