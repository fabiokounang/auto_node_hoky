const database = require('../util/database');

module.exports = class Toko {
  static getAllTokoactiveByUser(userId) {
    return database.execute(`SELECT * FROM master_toko WHERE id_toko IN(SELECT id_toko FROM rel_toko_user WHERE id_user = ${userId}) AND id_status = 0`);
  }
} 