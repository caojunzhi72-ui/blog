const pool = require('../config/db');

class Category {
  static async create(categoryData) {
    const { name, slug, description } = categoryData;
    const query = `
      INSERT INTO categories (name, slug, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [name, slug, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const query = 'SELECT * FROM categories WHERE slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  }

  static async update(id, categoryData) {
    const { name, slug, description } = categoryData;
    const query = `
      UPDATE categories
      SET name = $1, slug = $2, description = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const values = [name, slug, description, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM categories ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getArticleCount(category_id) {
    const query = 'SELECT COUNT(*) as count FROM articles WHERE category_id = $1 AND status = \'published\'';
    const result = await pool.query(query, [category_id]);
    return parseInt(result.rows[0].count);
  }
}