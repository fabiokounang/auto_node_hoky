const database = require('../util/database');

module.exports = class Emoney {
  static createEmoney(data) {
    return database.execute(`INSERT INTO master_emoney (nama_emoney, alias_emoney, kode_emoney) VALUES (?, ?, ?)`, [data.nama_emoney, data.alias_emoney, data.nama_emoney.toLowerCase() + '_emoney']);
  }

  static getEmoneyById(id) {
    return database.execute(`SELECT id_emoney, nama_emoney, alias_emoney, status_emoney FROM master_emoney WHERE id_emoney = ?`, [id]);
  }

  static updateEmoney(data, idEmoney) {
    return database.execute(`UPDATE master_emoney SET nama_emoney = ?, alias_emoney = ?, status_emoney = ? WHERE id_emoney = ?`, [data.nama_emoney, data.alias_emoney, data.status_emoney, idEmoney]);
  }

  static getAllEmoney(query) {
    return database.execute(query);
  }

  static getAllEmoneyActive() {
    return database.execute(`SELECT id_emoney, nama_emoney, alias_emoney, status_emoney FROM master_emoney WHERE status_emoney = 1`);
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
    return database.execute(`SELECT meu.id_emoney_user, meu.id_emoney, meu.id_toko, meu.nomor_emoney, meu.is_login, meu.auth_emoney, me.status_emoney FROM master_emoney_user AS meu JOIN master_emoney AS me ON meu.id_emoney = me.id_emoney WHERE nomor_emoney = ?`, [phone]);
  }

  static insertAuth(id, auth, state) {
    return database.execute(`UPDATE master_emoney_user SET is_login = ?, auth_emoney = '${JSON.stringify(auth)}' WHERE id_emoney_user = ?`, [state, id]);
  }

  static deleteAuthLogin(phone) {
    return database.execute(`UPDATE master_emoney_user SET is_login = 0, auth_emoney = NULL WHERE nomor_emoney = ?`, [phone]);
  }
}