import { Request, Response } from 'express';
import Post from '../model/post.model';
import Like from '../model/like.model';

import fileHandler from '../util/file-upload';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

async function createPost(req: Request, res: Response) {
    try {
        const userId = req.body.userId;

        // Prepare the photo
        const photo: any = req.files.photo;
        const key = Date.now() + '-' + photo.name;

        // Convert the photo to Stream format
        let body = fs.createReadStream(photo.tempFilePath);

        // Build a form that contains the photo
        const formData = new FormData();
        formData.append('image', body);

        // Generate the color palettes from Flask server
        const colorResponse = await axios.post(process.env.FLASK_SERVER,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        const colorPalette = colorResponse.data.colors;

        // Upload the photo to AWS S3 Storage
        body = fs.createReadStream(photo.tempFilePath);
        const photoUrl = await fileHandler.uploadFile(key, body);

        const newPost = new Post({
            user: userId,
            filename: key,
            photoUrl: photoUrl,
            caption: req.body.caption || '',
            colorPalette: colorPalette,
        });
        await newPost.save();

        return res.sendStatus(200);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

async function getPostById(req: Request, res: Response) {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;
        const post = await Post.findById(postId)
            .select('-__v')
            .populate('user', 'name username');

        const countLike = await Like.count({
            post: postId
        });

        const isLiked = (await Like.findOne({
            post: postId,
            user: userId
        })) != null;

        res.json({
            post,
            countLike,
            isLiked
        });
        return;
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

async function getAllPostByUser(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({ user: userId })
            .select('-__v')
            .populate('user', 'name username');

        return res.json(posts);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

async function updatePost(req: Request, res: Response) {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;

        const post = await Post.findById(postId);

        // If the user is not the post owner
        if (userId != post.user.toString()) {
            res.status(401);
            return res.json({ message: 'You are not authorized to update this post' });
        }

        await Post.findByIdAndUpdate(postId, {
            caption: req.body.caption
        });

        return res.sendStatus(200);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

async function deletePost(req: Request, res: Response) {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;

        const post = await Post.findById(postId);

        // If the user is not the post owner
        if (userId != post.user.toString()) {
            res.status(401);
            return res.json({ message: 'You are not authorized to remove this post' });
        }

        await Post.findByIdAndDelete(postId);
        await fileHandler.deleteFile(post.filename);

        return res.sendStatus(200);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
}

const postCtrl = {
    createPost,
    getPostById,
    getAllPostByUser,
    updatePost,
    deletePost
};

export default postCtrl;
