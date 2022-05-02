const database = require('../util/database');

module.exports = class Emoney {
  static createEmoneyUser(data) {
    return database.execute(`INSERT INTO master_emoney_user (id_emoney, nomor_emoney, id_toko) VALUES (?, ?, ?)`, [data.id_emoney, data.nomor_emoney, data.id_toko]);
  }

  static updateEmoneyUser(data, id) {
    return database.execute(`UPDATE master_emoney_user SET nomor_emoney = ?, id_toko = ? WHERE id_emoney_user = ?`, [data.nomor_emoney, data.id_toko, id]);
  }

  static getAllEmoneyUser(query) {
    return database.execute(query);
  }

  static getAllEmoneyUserByToko(query) {
    return database.execute(query);
  }

  static getEmoneyByIdAndPhone(id, phone) {
    return database.execute(`SELECT id_emoney, nomor_emoney FROM master_emoney_user WHERE id_emoney = ? AND nomor_emoney = ?`, [id, phone]);
  }

  static getTotalEmoneyUser(query) {
    let queryString = query;
    let tempData = query.split('FROM');
    tempData[0] = 'SELECT COUNT(meu.id_emoney) AS total ';
    queryString = tempData.join('FROM');
    if (queryString.includes('LIMIT')) queryString = queryString.split(' ').slice(0, queryString.split(' ').length - 2).join(' '); // Remove limit
    return database.execute(queryString);
  }

  static getDataByPhone(phone) {
    return database.execute(`SELECT meu.id_emoney_user, meu.id_emoney, meu.nomor_emoney, meu.is_login, meu.auth_emoney, me.status_emoney FROM master_emoney_user AS meu JOIN master_emoney AS me ON meu.id_emoney = me.id_emoney WHERE nomor_emoney = ?`, [phone]);
  }

  static insertAuth(id, auth) {
    return database.execute(`UPDATE master_emoney_user SET is_login = ?, auth_emoney = '${JSON.stringify(auth)}' WHERE id_emoney_user = ?`, [1, id]);
  }

  static deleteAuthLogin(phone) {
    return database.execute(`UPDATE master_emoney_user SET is_login = 0, auth_emoney = NULL WHERE nomor_emoney = ?`, [phone]);
  }

  static getAllPhoneByEmoney(data) {
    return database.execute(`SELECT * FROM master_emoney_user WHERE id_emoney = ? AND is_login >= ? AND auth_emoney IS NOT NULL`, [data.id_emoney, 3]);
  }
}