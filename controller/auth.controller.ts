import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import User from '../model/user.model';

dotenv.config();

const HASH_TIME = 12;

async function signUp(req: Request, res: Response) {
    try {
        // Generate a random 32-bit string for salt
        const salt = crypto.randomBytes(64).toString('hex');
        const hashPassword = bcrypt.hashSync(salt + req.body.password, HASH_TIME);

        const user = new User({
            email: req.body.email,
            password: hashPassword,
            salt: salt,
            name: req.body.name,
            username: req.body.username,
            photoUrl: null
        });

        await user.save();
        res.send({ message: 'Sign up successfully!' });
    } catch (err) {
        return res.status(400).send({ message: 'Sign up failed' });
    }
}

async function signIn(req: Request, res: Response) {
    try {
        const password = req.body.password;
        const email = req.body.email;
        const cookies = req.cookies;

        if (!password || !email) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        let user = await User.findOne({
            email: email
        }).select('+salt +password');

        if (!user) {
            return res.status(401).json({ message: "This account doesn't exist" });
        }

        const isPasswordValid = bcrypt.compareSync(user.salt + password, user.password as string);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate access and refresh tokens
        const accessToken = jwt.sign({ id: user._id },
            process.env.ACCESS_TOKEN_SECRET || '',
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '1d'
            });

        const newRefreshToken = jwt.sign({ id: user._id },
            process.env.REFRESH_TOKEN_SECRET || '',
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '1d'
            });

        let refreshTokenArray = !cookies?.jwt ? user.refreshToken : user.refreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) {
            /*
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken });

            // Detected refresh token reuse!
            if (!foundToken) {
                console.log('attempted refresh token reuse at login!')
                // clear out ALL previous refresh tokens
                refreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        }

        // Save refresh token with the current user
        user.refreshToken = [...refreshTokenArray, newRefreshToken];
        await user.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        return res.json({
            name: user.name,
            username: user.username,
            accessToken: accessToken
        });
    } catch (err) {
        return res.status(400).send({
            message: 'Sign in failed',
        });
    }
}

async function signOut(req: Request, res: Response) {
    try {
        // On client, also delete the accessToken
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); // No content
        const refreshToken = cookies.jwt;

        // Check if the refresh token is in database
        const user = await User.findOne({ refreshToken });
        if (user) {
            // Delete refreshToken in db
            user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);;
            await user.save();
        }

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        return res.sendStatus(204);
    } catch (err) {
        return res.status(400).send({
            message: 'Sign out failed',
        });
    }
}

async function handleRefreshToken(req: Request, res: Response) {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

        const foundUser = await User.findOne({ refreshToken });

        // Detected refresh token reuse!
        if (!foundUser) {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err: Error, decoded: any) => {
                    if (err) return res.sendStatus(403); //Forbidden
                    console.log('attempted refresh token reuse!')
                    const hackedUser = await User.findById(decoded.id);
                    hackedUser.refreshToken = [];
                    const result = await hackedUser.save();
                }
            );
            return res.sendStatus(403); //Forbidden
        }

        const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

        // Check jwt 
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err: Error, decoded: any) => {
                if (err) {
                    console.log('expired refresh token')
                    foundUser.refreshToken = [...newRefreshTokenArray];
                    const result = await foundUser.save();
                }

                if (err || foundUser._id.toString() !== decoded.id) return res.sendStatus(403);

                // Refresh token was still valid
                const accessToken = jwt.sign({ id: foundUser._id },
                    process.env.ACCESS_TOKEN_SECRET || '',
                    {
                        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '1d'
                    });

                const newRefreshToken = jwt.sign({ id: foundUser._id },
                    process.env.REFRESH_TOKEN_SECRET || '',
                    {
                        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '1d'
                    });
                // Saving refreshToken with current user
                foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
                await foundUser.save();

                // Creates Secure Cookie with refresh token
                res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });

                return res.json({
                    name: foundUser.name,
                    username: foundUser.username,
                    accessToken: accessToken
                });
            }
        );
    } catch (err) {
        return res.status(400).send({
            message: 'Handle refresh token failed',
        });
    }
}
const authCtrl = {
    signUp,
    signIn,
    signOut,
    handleRefreshToken
};

export default authCtrl;
