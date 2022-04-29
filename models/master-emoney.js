const database = require('../util/database');

module.exports = class Emoney {
  static getAllEmoney(query) {
    return database.execute(query);
  }

  static getTotalEmoney(query) {
    let queryString = query;
    let tempData = query.split('FROM');
    tempData[0] = 'SELECT COUNT(id_emoney) AS total ';
    queryString = tempData.join('FROM');
    if (queryString.includes('LIMIT')) queryString = queryString.split(' ').slice(0, queryString.split(' ').length - 2).join(' '); // Remove limit
    return database.execute(queryString);
  }

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