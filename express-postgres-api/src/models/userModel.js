const pool = require('../config/db');

class User {
  static async create(userData) {
    const { name, email, password, avatar, bio } = userData;
    const query = `
      INSERT INTO users (name, email, password, avatar, bio)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [name, email, password, avatar, bio];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { name, email, password, avatar, bio } = userData;
    const query = `
      UPDATE users
      SET name = $1, email = $2, password = $3, avatar = $4, bio = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const values = [name, email, password, avatar, bio, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = User;