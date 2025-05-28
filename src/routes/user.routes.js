import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';  
import { upload } from '../middlewares/multer.middleware.js'; 

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

export default router;