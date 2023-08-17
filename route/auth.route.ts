import express from 'express';
import authCtrl from '../controller/auth.controller';
import auth from '../middleware/auth';

const router = express.Router();

router.route('/signin').post(authCtrl.signIn);
router.route('/signup').post(auth.checkDuplicateEmail, authCtrl.signUp);
router.route('/signout').get(authCtrl.signOut);

export default router;
