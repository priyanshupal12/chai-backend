import { Router } from 'express';
import {
    loginUser,
    registerUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccoutDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from '../controllers/user.controller.js';
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

router.route('/change-password').post(verifyJWT, changeCurrentPassword);

router.route('/current-user').get(verifyJWT, getCurrentUser);

router.route('/update-account').patch(verifyJWT, updateAccoutDetails);

router.route('/avatar').patch(
    verifyJWT,
    upload.single('avatar'), // 'avatar' is the field name for the image upload
    updateUserAvatar
);

router.route('/cover-image').patch(
    verifyJWT,
    upload.single('coverImage'), // 'coverImage' is the field name for the image upload
    updateUserCoverImage
);

router.route('/c/:username').get(verifyJWT, getUserChannelProfile); // Get user by username

router.route('/history').get(verifyJWT, getWatchHistory)

export default router;