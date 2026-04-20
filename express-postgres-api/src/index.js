const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());

// 数据库连接
const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    // 初始化数据库表
    initDatabase();
  }
});

// 封装数据库操作
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

// 初始化数据库表
async function initDatabase() {
  try {
    // 创建用户表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建分类表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建标签表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建文章表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image TEXT,
        status TEXT DEFAULT 'draft',
        view_count INTEGER DEFAULT 0,
        user_id INTEGER,
        category_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      );
    `);

    // 创建文章标签关联表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS article_tags (
        article_id INTEGER,
        tag_id INTEGER,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);

    // 创建文档表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'document',
        status TEXT DEFAULT 'draft',
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 创建评论表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        user_id INTEGER,
        article_id INTEGER,
        parent_id INTEGER,
        status TEXT DEFAULT 'approved',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
      );
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// 生成JWT令牌
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// 验证JWT令牌
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// 认证中间件
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

// 认证路由
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // 检查用户是否已存在
    const existingUsers = await dbQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const result = await dbRun('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    
    // 获取创建的用户
    const users = await dbQuery('SELECT * FROM users WHERE id = ?', [result.lastID]);
    const user = users[0];

    // 生成JWT令牌
    const token = generateToken({
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
    console.error('Error in register:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 查找用户
    const users = await dbQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 生成JWT令牌
    const token = generateToken({
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
    console.error('Error in login:', error);
    res.status(500).json({ error: error.message });
  }
});

// 管理系统路由
app.use('/api/admin', authMiddleware);

app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    message: 'Welcome to admin dashboard',
    user: req.user
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json({
    message: 'Admin users list',
    user: req.user
  });
});

// 文章路由

// 获取文章列表
app.get('/api/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    
    if (status) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }
    
    const articles = await dbQuery(
      `SELECT * FROM articles ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    const total = await dbQuery(
      `SELECT COUNT(*) as count FROM articles ${whereClause}`,
      params
    );
    
    res.status(200).json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].count
      }
    });
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取文章详情
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const articles = await dbQuery('SELECT * FROM articles WHERE id = ?', [id]);
    if (articles.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    const article = articles[0];
    
    // 增加浏览量
    await dbRun('UPDATE articles SET view_count = view_count + 1 WHERE id = ?', [id]);
    
    res.status(200).json(article);
  } catch (error) {
    console.error('Error getting article:', error);
    res.status(500).json({ error: error.message });
  }
});

// 创建文章（需要认证）
app.post('/api/articles', authMiddleware, async (req, res) => {
  try {
    const { title, slug, content, excerpt, featured_image, category_id, status = 'draft' } = req.body;
    const user_id = req.user.id;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }
    
    // 检查slug是否已存在
    const existingArticles = await dbQuery('SELECT * FROM articles WHERE slug = ?', [slug]);
    if (existingArticles.length > 0) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    
    const result = await dbRun(
      'INSERT INTO articles (title, slug, content, excerpt, featured_image, status, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, content, excerpt, featured_image, status, user_id, category_id]
    );
    
    const articles = await dbQuery('SELECT * FROM articles WHERE id = ?', [result.lastID]);
    const article = articles[0];
    
    res.status(201).json({
      message: 'Article created successfully',
      article
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新文章（需要认证）
app.put('/api/articles/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, featured_image, category_id, status } = req.body;
    
    // 检查文章是否存在
    const existingArticles = await dbQuery('SELECT * FROM articles WHERE id = ?', [id]);
    if (existingArticles.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // 检查slug是否已被其他文章使用
    if (slug) {
      const slugArticles = await dbQuery('SELECT * FROM articles WHERE slug = ? AND id != ?', [slug, id]);
      if (slugArticles.length > 0) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }
    
    // 构建更新语句
    const updates = [];
    const params = [];
    
    if (title) { updates.push('title = ?'); params.push(title); }
    if (slug) { updates.push('slug = ?'); params.push(slug); }
    if (content) { updates.push('content = ?'); params.push(content); }
    if (excerpt) { updates.push('excerpt = ?'); params.push(excerpt); }
    if (featured_image) { updates.push('featured_image = ?'); params.push(featured_image); }
    if (category_id) { updates.push('category_id = ?'); params.push(category_id); }
    if (status) { updates.push('status = ?'); params.push(status); }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const sql = `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`;
    await dbRun(sql, params);
    
    const articles = await dbQuery('SELECT * FROM articles WHERE id = ?', [id]);
    const article = articles[0];
    
    res.status(200).json({
      message: 'Article updated successfully',
      article
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除文章（需要认证）
app.delete('/api/articles/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查文章是否存在
    const existingArticles = await dbQuery('SELECT * FROM articles WHERE id = ?', [id]);
    if (existingArticles.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    await dbRun('DELETE FROM articles WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: error.message });
  }
});

// 发布文章（需要认证）
app.put('/api/articles/:id/publish', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查文章是否存在
    const existingArticles = await dbQuery('SELECT * FROM articles WHERE id = ?', [id]);
    if (existingArticles.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    await dbRun('UPDATE articles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['published', id]);
    
    const articles = await dbQuery('SELECT * FROM articles WHERE id = ?', [id]);
    const article = articles[0];
    
    res.status(200).json({
      message: 'Article published successfully',
      article
    });
  } catch (error) {
    console.error('Error publishing article:', error);
    res.status(500).json({ error: error.message });
  }
});

// 下架文章（需要认证）
app.put('/api/articles/:id/unpublish', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查文章是否存在
    const existingArticles = await dbQuery('SELECT * FROM articles WHERE id = ?', [id]);
    if (existingArticles.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    await dbRun('UPDATE articles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['draft', id]);
    
    const articles = await dbQuery('SELECT * FROM articles WHERE id = ?', [id]);
    const article = articles[0];
    
    res.status(200).json({
      message: 'Article unpublished successfully',
      article
    });
  } catch (error) {
    console.error('Error unpublishing article:', error);
    res.status(500).json({ error: error.message });
  }
});

// 搜索路由
app.get('/api/search', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    let results = [];
    
    // 搜索文章
    if (type === 'all' || type === 'articles') {
      const articles = await dbQuery(
        `SELECT id, title, excerpt, created_at FROM articles 
         WHERE (title LIKE ? OR content LIKE ? OR excerpt LIKE ?) 
         AND status = 'published' 
         ORDER BY created_at DESC LIMIT 20`,
        [`%${q}%`, `%${q}%`, `%${q}%`]
      );
      results = results.concat(articles.map(article => ({
        ...article,
        type: 'article'
      })));
    }
    
    // 搜索文档
    if (type === 'all' || type === 'documents') {
      const documents = await dbQuery(
        `SELECT id, title, content, created_at FROM documents 
         WHERE (title LIKE ? OR content LIKE ?) 
         AND status = 'published' 
         ORDER BY created_at DESC LIMIT 20`,
        [`%${q}%`, `%${q}%`]
      );
      results = results.concat(documents.map(document => ({
        ...document,
        type: 'document'
      })));
    }
    
    res.status(200).json({
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: error.message });
  }
});

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// 文档路由

// 获取文档列表
app.get('/api/documents', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    
    if (status) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }
    
    const documents = await dbQuery(
      `SELECT * FROM documents ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    const total = await dbQuery(
      `SELECT COUNT(*) as count FROM documents ${whereClause}`,
      params
    );
    
    res.status(200).json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].count
      }
    });
  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取文档详情
app.get('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const documents = await dbQuery('SELECT * FROM documents WHERE id = ?', [id]);
    if (documents.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    const document = documents[0];
    
    res.status(200).json(document);
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({ error: error.message });
  }
});

// 创建文档（需要认证）
app.post('/api/documents', authMiddleware, async (req, res) => {
  try {
    const { title, slug, content, type = 'document', status = 'draft' } = req.body;
    const user_id = req.user.id;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }
    
    // 检查slug是否已存在
    const existingDocuments = await dbQuery('SELECT * FROM documents WHERE slug = ?', [slug]);
    if (existingDocuments.length > 0) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    
    const result = await dbRun(
      'INSERT INTO documents (title, slug, content, type, status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, content, type, status, user_id]
    );
    
    const documents = await dbQuery('SELECT * FROM documents WHERE id = ?', [result.lastID]);
    const document = documents[0];
    
    res.status(201).json({
      message: 'Document created successfully',
      document
    });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新文档（需要认证）
app.put('/api/documents/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, type, status } = req.body;
    
    // 检查文档是否存在
    const existingDocuments = await dbQuery('SELECT * FROM documents WHERE id = ?', [id]);
    if (existingDocuments.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // 检查slug是否已被其他文档使用
    if (slug) {
      const slugDocuments = await dbQuery('SELECT * FROM documents WHERE slug = ? AND id != ?', [slug, id]);
      if (slugDocuments.length > 0) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }
    
    // 构建更新语句
    const updates = [];
    const params = [];
    
    if (title) { updates.push('title = ?'); params.push(title); }
    if (slug) { updates.push('slug = ?'); params.push(slug); }
    if (content) { updates.push('content = ?'); params.push(content); }
    if (type) { updates.push('type = ?'); params.push(type); }
    if (status) { updates.push('status = ?'); params.push(status); }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const sql = `UPDATE documents SET ${updates.join(', ')} WHERE id = ?`;
    await dbRun(sql, params);
    
    const documents = await dbQuery('SELECT * FROM documents WHERE id = ?', [id]);
    const document = documents[0];
    
    res.status(200).json({
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除文档（需要认证）
app.delete('/api/documents/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查文档是否存在
    const existingDocuments = await dbQuery('SELECT * FROM documents WHERE id = ?', [id]);
    if (existingDocuments.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    await dbRun('DELETE FROM documents WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: error.message });
  }
});

// 发布文档（需要认证）
app.put('/api/documents/:id/publish', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查文档是否存在
    const existingDocuments = await dbQuery('SELECT * FROM documents WHERE id = ?', [id]);
    if (existingDocuments.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    await dbRun('UPDATE documents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['published', id]);
    
    const documents = await dbQuery('SELECT * FROM documents WHERE id = ?', [id]);
    const document = documents[0];
    
    res.status(200).json({
      message: 'Document published successfully',
      document
    });
  } catch (error) {
    console.error('Error publishing document:', error);
    res.status(500).json({ error: error.message });
  }
});

// 下架文档（需要认证）
app.put('/api/documents/:id/unpublish', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查文档是否存在
    const existingDocuments = await dbQuery('SELECT * FROM documents WHERE id = ?', [id]);
    if (existingDocuments.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    await dbRun('UPDATE documents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['draft', id]);
    
    const documents = await dbQuery('SELECT * FROM documents WHERE id = ?', [id]);
    const document = documents[0];
    
    res.status(200).json({
      message: 'Document unpublished successfully',
      document
    });
  } catch (error) {
    console.error('Error unpublishing document:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express PostgreSQL API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});