const pool = require('../config/db');

class Tag {
  static async create(tagData) {
    const { name, slug } = tagData;
    const query = `
      INSERT INTO tags (name, slug)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [name, slug];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM tags WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const query = 'SELECT * FROM tags WHERE slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  }

  static async update(id, tagData) {
    const { name, slug } = tagData;
    const query = `
      UPDATE tags
      SET name = $1, slug = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const values = [name, slug, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM tags WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM tags ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getArticleCount(tag_id) {
    const query = `
      SELECT COUNT(*) as count
      FROM article_tags
      JOIN articles ON article_tags.article_id = articles.id
      WHERE article_tags.tag_id = $1 AND articles.status = 'published'
    `;
    const result = await pool.query(query, [tag_id]);
    return parseInt(result.rows[0].count);
  }

  static async getArticles(tag_id, limit = 10, offset = 0) {
    const query = `
      SELECT articles.*, users.name as author_name
      FROM articles
      JOIN article_tags ON articles.id = article_tags.article_id
      JOIN users ON articles.user_id = users.id
      WHERE article_tags.tag_id = $1 AND articles.status = 'published'
      ORDER BY articles.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [tag_id, limit, offset]);
    return result.rows;
  }
}