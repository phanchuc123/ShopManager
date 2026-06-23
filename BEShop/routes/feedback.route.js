const {insertfeelBack} = require("../controllers/feedback.controller");
const express = require('express');
const router = express.Router();

router.post('/insertFB',insertfeelBack);
module.exports = router;