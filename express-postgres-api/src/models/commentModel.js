const pool = require('../config/db');

class Comment {
  static async create(commentData) {
    const { content, user_id, article_id, parent_id, status } = commentData;
    const query = `
      INSERT INTO comments (content, user_id, article_id, parent_id, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [content, user_id, article_id, parent_id, status];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT comments.*, users.name as author_name
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      WHERE comments.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, commentData) {
    const { content, status } = commentData;
    const query = `
      UPDATE comments
      SET content = $1, status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const values = [content, status, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM comments WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getByArticle(article_id, limit = 20, offset = 0) {
    const query = `
      SELECT comments.*, users.name as author_name
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      WHERE comments.article_id = $1 AND comments.status = 'approved' AND comments.parent_id IS NULL
      ORDER BY comments.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [article_id, limit, offset]);
    return result.rows;
  }

  static async getReplies(parent_id, limit = 20, offset = 0) {
    const query = `
      SELECT comments.*, users.name as author_name
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      WHERE comments.parent_id = $1 AND comments.status = 'approved'
      ORDER BY comments.created_at ASC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [parent_id, limit, offset]);
    return result.rows;
  }

  static async getByUser(user_id, limit = 20, offset = 0) {
    const query = `
      SELECT comments.*, users.name as author_name, articles.title as article_title
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      LEFT JOIN articles ON comments.article_id = articles.id
      WHERE comments.user_id = $1
      ORDER BY comments.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [user_id, limit, offset]);
    return result.rows;
  }

  static async getCountByArticle(article_id) {
    const query = 'SELECT COUNT(*) as count FROM comments WHERE article_id = $1 AND status = \'approved\'';
    const result = await pool.query(query, [article_id]);
    return parseInt(result.rows[0].count);
  }
}