const pool = require('../config/db');

class Article {
  static async create(articleData) {
    const { title, slug, content, excerpt, featured_image, status, user_id, category_id } = articleData;
    const query = `
      INSERT INTO articles (title, slug, content, excerpt, featured_image, status, user_id, category_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [title, slug, content, excerpt, featured_image, status, user_id, category_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT articles.*, users.name as author_name
      FROM articles
      LEFT JOIN users ON articles.user_id = users.id
      WHERE articles.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const query = `
      SELECT articles.*, users.name as author_name
      FROM articles
      LEFT JOIN users ON articles.user_id = users.id
      WHERE articles.slug = $1
    `;
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  }

  static async update(id, articleData) {
    const { title, slug, content, excerpt, featured_image, status, category_id } = articleData;
    const query = `
      UPDATE articles
      SET title = $1, slug = $2, content = $3, excerpt = $4, featured_image = $5, status = $6, category_id = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    const values = [title, slug, content, excerpt, featured_image, status, category_id, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM articles WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(limit = 10, offset = 0) {
    const query = `
      SELECT articles.*, users.name as author_name, categories.name as category_name
      FROM articles
      LEFT JOIN users ON articles.user_id = users.id
      LEFT JOIN categories ON articles.category_id = categories.id
      WHERE articles.status = 'published'
      ORDER BY articles.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async getByCategory(category_id, limit = 10, offset = 0) {
    const query = `
      SELECT articles.*, users.name as author_name, categories.name as category_name
      FROM articles
      LEFT JOIN users ON articles.user_id = users.id
      LEFT JOIN categories ON articles.category_id = categories.id
      WHERE articles.status = 'published' AND articles.category_id = $1
      ORDER BY articles.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [category_id, limit, offset]);
    return result.rows;
  }

  static async incrementViewCount(id) {
    const query = 'UPDATE articles SET view_count = view_count + 1 WHERE id = $1';
    await pool.query(query, [id]);
  }

  static async addTag(article_id, tag_id) {
    const query = 'INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2)';
    await pool.query(query, [article_id, tag_id]);
  }

  static async removeTag(article_id, tag_id) {
    const query = 'DELETE FROM article_tags WHERE article_id = $1 AND tag_id = $2';
    await pool.query(query, [article_id, tag_id]);
  }

  static async getTags(article_id) {
    const query = `
      SELECT tags.*
      FROM tags
      JOIN article_tags ON tags.id = article_tags.tag_id
      WHERE article_tags.article_id = $1
    `;
    const result = await pool.query(query, [article_id]);
    return result.rows;
  }
}