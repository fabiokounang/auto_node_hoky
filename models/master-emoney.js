const database = require('../util/database');

module.exports = class Emoney {
  static getDataByPhone(phone) {
    return database.execute(`SELECT id_emoney_user, id_emoney, nomor_emoney, is_login, auth_emoney FROM master_emoney_user WHERE nomor_emoney = ?`, [phone]);
  }

  static insertAuth(id, auth) {
    return database.execute(`UPDATE master_emoney_user SET is_login = ?, auth_emoney = '${JSON.stringify(auth)}' WHERE id_emoney_user = ?`, [1, id]);
  }

  static deleteAuthLogin(phone) {
    return database.execute(`UPDATE master_emoney_user SET is_login = 0, auth_emoney = NULL WHERE nomor_emoney = ?`, [phone]);

  }
}