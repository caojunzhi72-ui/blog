const pool = require('../config/db');

class Document {
  static async create(documentData) {
    const { title, slug, content, type, user_id } = documentData;
    const query = `
      INSERT INTO documents (title, slug, content, type, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [title, slug, content, type, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT documents.*, users.name as author_name
      FROM documents
      LEFT JOIN users ON documents.user_id = users.id
      WHERE documents.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const query = `
      SELECT documents.*, users.name as author_name
      FROM documents
      LEFT JOIN users ON documents.user_id = users.id
      WHERE documents.slug = $1
    `;
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  }

  static async update(id, documentData) {
    const { title, slug, content, type } = documentData;
    const query = `
      UPDATE documents
      SET title = $1, slug = $2, content = $3, type = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const values = [title, slug, content, type, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM documents WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(limit = 10, offset = 0) {
    const query = `
      SELECT documents.*, users.name as author_name
      FROM documents
      LEFT JOIN users ON documents.user_id = users.id
      ORDER BY documents.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async getByType(type, limit = 10, offset = 0) {
    const query = `
      SELECT documents.*, users.name as author_name
      FROM documents
      LEFT JOIN users ON documents.user_id = users.id
      WHERE documents.type = $1
      ORDER BY documents.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [type, limit, offset]);
    return result.rows;
  }

  static async getByUser(user_id, limit = 10, offset = 0) {
    const query = `
      SELECT documents.*, users.name as author_name
      FROM documents
      LEFT JOIN users ON documents.user_id = users.id
      WHERE documents.user_id = $1
      ORDER BY documents.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [user_id, limit, offset]);
    return result.rows;
  }
}