import jwt, { TokenExpiredError } from 'jsonwebtoken';
import User from '../model/user.model';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: 'No authorization token provided!' });
        }

        // Extract the token from the header
        let token = req.headers.authorization?.replace('Bearer ', '');

        // No token provided handler
        if (!token) {
            return res.status(401).send({ message: 'No token provided!' });
        }

        // Decode the token into the userId
        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', ()=>{});
        req.body.userId = decoded.id;

        next();
    } catch (e) {
        return res.status(400).send({ message: 'Verify token failed' });
    }
}

async function checkDuplicateEmail(req: Request, res: Response, next: NextFunction) {
    try {
        // Find if there's any account with the provided email
        const user = await User.findOne({ email: req.body.email });

        // If the user exists, it means the email is used
        if (user) {
            return res.status(409).send({ message: 'Failed! Email is already used!' });
        }

        next();
    } catch (e) {
        return res.status(400).send({ message: 'Check duplicate email failed' });
    }
}

const auth = {
    verifyToken,
    checkDuplicateEmail
};

export default auth;
