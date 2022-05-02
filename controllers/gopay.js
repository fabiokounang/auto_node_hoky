const { validationResult } = require('express-validator');
const { GojekApi } = require('gojek-api');
const gojekApi = new GojekApi();
const { uuid } = require('uuidv4');
const EmoneyUser = require('../models/master-emoney-user');

exports.login = async (req, res, next) => {
  try {
    // 0) get ke table emoneyuser by phone
    // 1) cek jika sudah ada session dan device id di table user
    // 2) jika belum ada, create session dan deviceid dan save ke table user
    // 3) jika sudah ada, hit login ke gojek api
    // 4) response
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error('Data request tidak valid');
    const [emoneyUser] = await EmoneyUser.getDataByPhone(req.body.phone);
    if (emoneyUser.length <= 0) throw new Error('Nomor tidak terdaftar di sistem');
    let dataAuth = null;
    if (emoneyUser[0].auth_emoney) {
      dataAuth = JSON.parse(emoneyUser[0].auth_emoney);
      const sessionId = gojekApi.setSessionId(uuid());
      const deviceId = gojekApi.setdeviceId(uuid());
      if (!dataAuth.gopaySessionId && !dataAuth.gopayDeviceId) {
        dataAuth.gopaySessionId = sessionId;
        dataAuth.gopayDeviceId = deviceId;
        await EmoneyUser.insertAuth(dataAuth);
      }
    } else {
      dataAuth.gopaySessionId = sessionId;
      dataAuth.gopayDeviceId = deviceId;
      await EmoneyUser.insertAuth(dataAuth);
    }
    gojekApi.setSessionId(dataAuth.gopaySessionId);
    gojekApi.setdeviceId(dataAuth.gopayDeviceId);
    const result = await gojekApi.loginRequest(req.body.phone);
    res.send({
      status: true,
      data: result
    })
  } catch (error) {
    res.send({
      status: false,
      data: [],
      error: error.stack ? error.stack : error.message ? error.message : error || 'error.general'
    });
  }
}