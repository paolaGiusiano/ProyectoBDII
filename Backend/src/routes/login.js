const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController');


router.get('/login', LoginController.index);
router.post('/auth', LoginController.auth);
router.get('/logout', LoginController.logout);
router.post('/', loginController.login);

module.exports = router;
