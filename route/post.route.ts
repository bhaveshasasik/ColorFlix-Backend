import postCtrl from '../controller/post.controller';
import auth from '../middleware/auth';
import express from "express";
import fileUpload from 'express-fileupload';

const router = express.Router();

router.route('/:postId')
    .get(postCtrl.getPostById)
    .delete(auth.verifyToken, postCtrl.deletePost);

router.route('/user/:userId')
    .get(postCtrl.getAllPostByUser);

// The routes below requires token provided
router.use(auth.verifyToken);
router.route('/')
    .post(fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }), postCtrl.createPost)
    .put(postCtrl.updatePost);

export default router;
