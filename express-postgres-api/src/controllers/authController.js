const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const JWTUtils = require('../utils/jwt');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // 查找用户
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // 生成JWT令牌
      const token = JWTUtils.generateToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      // 检查用户是否已存在
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // 哈希密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      // 生成JWT令牌
      const token = JWTUtils.generateToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;