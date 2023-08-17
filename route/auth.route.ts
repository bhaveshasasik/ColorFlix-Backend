import express from 'express';
import authCtrl from '../controller/auth.controller';
import auth from '../middleware/auth';

const router = express.Router();

router.route('/signin').post(authCtrl.signIn);
router.route('/signup').post(auth.checkDuplicateEmail, auth.checkDuplicateUsername, authCtrl.signUp);
router.route('/signout').post(authCtrl.signOut);
router.route('/refreshtoken').get(authCtrl.handleRefreshToken);

export default router;
