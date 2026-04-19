const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 应用认证中间件
router.use(authMiddleware);

// 管理系统路由
router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Welcome to admin dashboard',
    user: req.user
  });
});

router.get('/users', (req, res) => {
  res.json({
    message: 'Admin users list',
    user: req.user
  });
});

module.exports = router;