
const express = require('express');
const { register, login, updateUser } = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update', authenticate, updateUser);

router.get('/protected', authenticate, (req, res) => {
    const userData = {
        id: 1,
        username: req.user.username,
        email: `${req.user.username}@example.com`
    };
    res.json({
        message: `Welcome ${req.user.username}`,
        data: userData
    });
});

module.exports = router;
