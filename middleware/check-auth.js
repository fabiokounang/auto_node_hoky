const axios = require('axios');
// console.log(process.env.URL_MUTATION);
module.exports = async (req, res, next) => {
  // var fullUrl = req.protocol + '://' + req.get('host') + '/node' + req.originalUrl;

  // console.log(fullUrl);
  // console.log(`http://auto-app/master/login/api${req.originalUrl}?time=${Date.now()}`);
  // console.log({ 'Cookie': req.headers.cookie });
  // const response = await axios({
  //   url: `http://auto-app/master/login/api${req.originalUrl}?time=${Date.now()}`,
  //   method: 'GET',
  //   headers: { 'Cookie': req.headers.cookie }
  // });
  // console.log(response.data);
  if (!req.cookies.ci_session) return res.send({ status: false, error: ['error.notloggedin'] });

  // get login ke con2 untuk validasi auth
  // check type untuk validasi user type
  // company , crud emoneylist, crud emoneyuser, get mutation
  // superadmin, read emoneylist, crud emoneyuser, get mutation
  // admin, read emoneylist, crud emoneyuser, get mutation
  // audit, cs -> read emoneylist, read emoneyuser, get mutation
  next();
}