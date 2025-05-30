import { Router } from 'express';
import { loginUser, registerUser, logoutUser, refreshAccessToken } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar', // 'avatar' is the field name for the image upload
            maxCount: 1 // Limit to one file for avatar
        },
        {
            name: 'coverImage',
            maxCount: 1 // Limit to one file for cover image
        }
    ]), // 'avatar' is the field name for the image upload
    registerUser)

router.route('/login').post(loginUser);

//secure routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken)


export default router;