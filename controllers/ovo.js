const OVOID = require('ovoid');
const Emoney = require('../models/master-emoney');

exports.login = async (req, res, next) => {
  try {
    const ovoid = new OVOID();
    let loginResult = await ovoid.login2FA(req.body.phone);
    if (!loginResult.otp_refId || !loginResult.device_id) throw new Error('Login ovo failed');
    const [resultUpdate] = await Emoney.insertAuth(req.dataOvo.id_emoney_user, loginResult, 1);
    if (resultUpdate.affectedRows != 1) throw new Error('Error update login, please try again in a few minutes');
    return res.send({ status: true });
  } catch (error) {
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}

exports.accesstoken = async (req, res, next) => {
  try {
    const ovoid = new OVOID();
    let dataAuth = JSON.parse(req.dataOvo.auth_emoney);
    const accessToken = await ovoid.login2FAVerify(dataAuth.otp_refId, req.body.code, req.body.phone, dataAuth.device_id);
    dataAuth = Object.assign({}, dataAuth, { ...accessToken });
    const [resultUpdate] = await Emoney.insertAuth(req.dataOvo.id_emoney_user, dataAuth, 2);
    if (resultUpdate.affectedRows != 1) throw new Error('Error update access token, please try again in a few minutes');
    return res.send({ status: true });
  } catch (error) {
    await Emoney.deleteAuthLogin(req.body.phone);
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}

exports.confirmpin = async (req, res, next) => {
  try {
    let dataAuth = JSON.parse(req.dataOvo.auth_emoney);
    const ovoid = new OVOID();
    const authToken = await ovoid.loginSecurityCode(req.body.pin, dataAuth.otp_token, req.body.phone, dataAuth.otp_refId, dataAuth.device_id);
    dataAuth = Object.assign({}, dataAuth, { ...authToken });
    const [resultUpdate] = await Emoney.insertAuth(req.dataOvo.id_emoney_user, dataAuth, 3);
    if (resultUpdate.affectedRows != 1) throw new Error('Error update access token, please try again in a few minutes');
    return res.send({ status: true });
  } catch (error) {
    await Emoney.deleteAuthLogin(req.body.phone);
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}

exports.balance = async (req, res, next) => {
  try {
    const dataAuth = JSON.parse(req.dataOvo.auth_emoney);
    const ovoid = new OVOID(dataAuth.refresh_token);
    let profile = await ovoid.getProfile();
    console.log(JSON.stringify(profile))
    const balanceCash = await ovoid.getBalance('tipe');

    return res.send({ status: true, data: { balance: balanceCash } });
  } catch (error) {
    await Emoney.deleteAuthLogin(req.body.phone);
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}

exports.mutation = async (req, res, next) => {
  try {
    const dataAuth = JSON.parse(req.dataOvo.auth_emoney);
    const ovoid = new OVOID(dataAuth.refresh_token);
    const results = await ovoid.getWalletTransaction(req.body.page || 1, req.body.limit || 10);
    if (results.status == 200) {
      const finalResult = [...results.data[0].complete, ...results.data[0].pending];
      // get page 1 (3) 1,2,3
      // cek ke db ada id 1,2,3
      // loop
      // jika ada 1,2 ambil dari db, 
      // jika tidak ada id 3 save ke tabel mutasi ovo dan tampilkan juga
      // tambah 1 kolom status
      // default status 1 (not process)
      // get page 2 (50) 4,5,6

      // user klik update status id 1
      // hit api update status jadi 2 (process)

      // get page 1 (3) 1,2,3
      // cek ke db ada id 1,2,3
      // ada semua ? get dari db semua



      return res.send({
        status: true,
        data: {
          page: req.body.page,
          limit: req.body.limit,
          values: finalResult
        }
      });
    }
    res.send({
      status: true,
      data: {
        page: 1,
        limit: 50,
        values: []
      }
    });
  } catch (error) {
    await Emoney.deleteAuthLogin(req.body.phone);
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}

exports.logout = async (req, res, next) => {
  try {
    const dataAuth = JSON.parse(req.dataOvo.auth_emoney);
    if (!dataAuth || (dataAuth && !dataAuth.refresh_token)) {
      const [resultUpdate] = await Emoney.deleteAuthLogin(req.body.phone);
      // if (resultUpdate.affectedRows != 1) throw new Error('Error delete login, please try again in a few minutes');
      return res.send({ status: true });
    }
    const ovoid = new OVOID(dataAuth.refresh_token);
    const logoutResult = await ovoid.logout();
    const [resultUpdate] = await Emoney.deleteAuthLogin(req.body.phone);
    // if (resultUpdate.affectedRows != 1) throw new Error('Error delete login, please try again in a few minutes');
    return res.send({ status: true });
  } catch (error) {
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}