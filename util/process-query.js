module.exports = (data) => {
  let query = `SELECT id_emoney, nama_emoney, alias_emoney, kode_emoney, url_emoney FROM master_emoney`;
  let page = (data.page == 0 ? 1 : data.page) || 1;
  let limit = data.limit || 10;
  let search = data.search || '';
  let sort_attr = 'created_at';
  let sort = 'DESC'; // DESC DEFAULT

  page = (page - 1) * limit;
  if (['created_at', 'nama_emoney', 'alias_emoney', 'kode_emoney'].includes(sort_attr)) sort_attr = data.sort_attr ? data.sort_attr : sort_attr;
  sort = data.sort ? data.sort == 1 ? 'ASC' : 'DESC' : sort;
  search = data.search ? data.search : search;

  if (search) query += ` WHERE nama_emoney LIKE '%${search}%' OR alias_emoney LIKE '%${search}%' OR kode_emoney LIKE '%${search}%'`;
  if (sort_attr) query += ` ORDER BY ${sort_attr} `;
  if (sort && sort_attr) query += sort;
  if (limit != -1) query += ` LIMIT ${page},${limit}`;
  return { query: query, page: page, limit: limit }
}