module.exports = (data) => {
  let query = `SELECT meu.id_emoney_user, meu.id_emoney, meu.nomor_emoney, meu.is_login, meu.id_toko, me.nama_emoney, me.status_emoney, meu.auth_emoney FROM master_emoney_user AS meu JOIN master_emoney AS me ON meu.id_emoney = me.id_emoney WHERE meu.id_toko = ${data.id_toko}`;
  console.log(query)
  let page = (data.page == 0 ? 1 : data.page) || 1;
  let limit = data.limit || 10;
  let search = data.search || '';

  page = (page - 1) * limit;
  search = data.search ? data.search : search;

  if (search) query += ` WHERE meu.nomor_emoney LIKE '%${search}%'`;
  query += ` ORDER BY meu.created_at DESC `;
  if (limit != -1) query += ` LIMIT ${page},${limit}`;
  return { query: query, page: page, limit: limit }
}