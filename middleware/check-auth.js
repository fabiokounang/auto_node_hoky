const axios = require('axios');
const UserToko = require('../models/master-user-toko');

module.exports = async (req, res, next) => {
  if (!req.headers.id) return res.send({ status: false, error: ['error.notloggedin'] });
  req.userId = req.headers.id.split('-')[0];
  req.userType = req.headers.id.split('-')[1];

  if (!req.userId || !req.userType) return res.send({ status: false, error: ['error.notloggedin'] });
  if (!req.cookies.ci_session) return res.send({ status: false, error: ['error.notloggedin'] });
  const [userToko] = await UserToko.getMasterUserToko(req.userId);
  req.userToko = userToko.map(val => val.id_toko);
  // company , crud emoneylist, crud emoneyuser, get mutation
  // superadmin, read emoneylist, crud emoneyuser, get mutation
  // admin, read emoneylist, crud emoneyuser, get mutation
  // audit, cs -> read emoneylist, read emoneyuser, get mutation
  next();
}