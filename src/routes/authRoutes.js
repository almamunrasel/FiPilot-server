const express=require('express');
const {register, login, googleAuth, getMe, updateProfile } = require('../controllers/authController');
const {protected}=require('../middlewares/auth');



const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/google',googleAuth);
router.get('/getme',protected, getMe);
router.patch('/updateprofile',protected,updateProfile);


module.exports=router;