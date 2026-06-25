const express = require('express');
const router = express.Router();
const { register, login, firebaseLogin, googleLogin, updateProfile } = require('../controllers/user.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/firebase-login', firebaseLogin);
router.post('/google-login', googleLogin);
router.put('/update', updateProfile);

module.exports = router;