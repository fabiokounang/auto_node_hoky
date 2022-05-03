const database = require('../util/database');

module.exports = class UserToko {
  static getMasterUserToko(userId) {
    return database.execute(`SELECT id_toko, id_user FROM rel_toko_user WHERE id_user = ?`, [userId]);
  }
} 