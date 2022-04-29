const OVOID = require('ovoid');
const Emoney = require('../models/master-emoney');

exports.login = async (req, res, next) => {
  try {
    const ovoid = new OVOID();
    let loginResult = await ovoid.login2FA(req.body.phone);
    console.log(loginResult, 'login result');
    if (!loginResult.otp_refId || !loginResult.device_id) throw new Error('Login ovo failed');
    const [resultUpdate] = await Emoney.insertAuth(req.dataOvo.id_emoney_user, loginResult);
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
    const [resultUpdate] = await Emoney.insertAuth(req.dataOvo.id_emoney_user, dataAuth);
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
    console.log(authToken, 'response pin')
    dataAuth = Object.assign({}, dataAuth, { ...authToken });
    console.log(dataAuth, 'data auth')
    const [resultUpdate] = await Emoney.insertAuth(req.dataOvo.id_emoney_user, dataAuth);
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
    console.log(dataAuth.refresh_token)
    const ovoid = new OVOID(dataAuth.refresh_token);
    const results = await ovoid.getWalletTransaction(req.body.page || 1, req.body.limit || 10);
    if (results.status == 200) return res.send({ status: true, data: results.data[0] });
    res.send({ status: true, data: { complete: [], pending: [] } });
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
    if (req.dataOvo.auth_emoney && !req.dataOvo.refresh_token) return res.send({ status: true });
    const dataAuth = JSON.parse(req.dataOvo.auth_emoney);
    const ovoid = new OVOID(dataAuth.refresh_token);
    const logoutResult = await ovoid.logout();
    const [resultUpdate] = await Emoney.deleteAuthLogin(req.body.phone);
    if (resultUpdate.affectedRows != 1) throw new Error('Error delete login, please try again in a few minutes');
    return res.send({ status: true });
  } catch (error) {
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}