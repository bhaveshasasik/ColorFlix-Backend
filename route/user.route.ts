import express from 'express';
import userCtrl from '../controller/user.controller';
import auth from '../middleware/auth';

const router = express.Router();

router.use(auth.verifyToken);

router.route('/')
    .get(userCtrl.getInfo)
    .put(userCtrl.updateInfo);

export default router;
