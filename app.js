const express = require('express');
const app = express();
const OVOID = require('ovoid');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;
const database = require('./util/database');
const Emoney = require('./models/master-emoney');
const ovoMiddleware = require('./middleware/ovo-middleware');

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/*', async (req, res, next) => {
  try {
    const whitelistParams = ['datesistemdari', 'datesistemke', 'nomorrekening', 'group', 'id_status_trx'];
    const parameters = req.params[0].split('/').filter(val => val);
    let fixParams = '';

    for (let i = 0; i < parameters.length; i += 2) {
      if (!whitelistParams.includes(parameters[i])) return res.send({ status: false, content: [], error: 'error.general' });
      fixParams += parameters[i] + '/' + parameters[i + 1] + '/';
    }

    const response = await axios({
      url: `${process.env.URL_MUTATION}/${fixParams}?time=1649835763977`,
      method: 'GET',
      headers: { 'Cookie': req.headers.cookie }
    });

    if (response.data === 'error.notloggedin') return res.send({ status: false, content: [], error: 'error.notloggedin' });
    if (!response.data.status) return res.send({ status: false, content: [], error: 'error.general' });
    if (response.data.content) {
      response.data.content = response.data.content.map((value) => {
        if (value.data && value.data.length > 0) {
          value.data.forEach((val) => {
            // val.deskripsi = '04/19 95031 \nDIDIN SAHIDIN\nTRSF E-BANKING CR';
            // val.deskripsi = 'EDI SUSTANTO\nTRSF E-BANKING DB\n1904/FTSCY/WS95011\n 1580000.00';
            // val.deskripsi = 'EDI SUSTANTO\nTRSF E-BANKING DB\n2703/FTSCY/WS95011\n 5300000.00';
            // val.deskripsi = 'RUSDI HANDOKO\nTRSF E-BANKING CR\n1904/FTSCY/WS95011\n 500000.00';
            // val.deskripsi = 'TANGGAL :27/03 27/03 WSID:Z74J1 PATIMAH\nSETORAN VIA CDM';
            // val.deskripsi = 'TANGGAL :21/03 TRANSFER DR 014 ARI PRABOWO AFMT WANA\nSWITCHING CR';
            // val.deskripsi = '04/18 127C1 \nROMINI\nTRSF E-BANKING CR';

            let splDesc = val.deskripsi.split('\n');
            if (splDesc.length > 0) {
              if (splDesc[0].includes('/') && !splDesc[0].includes('TANGGAL')) {
                const idx = val.deskripsi.indexOf(splDesc[1]);
                if (idx != -1) {
                  if (splDesc[1]) {
                    const nameLength = splDesc[1].length;
                    val.deskripsi = splDesc[1] + ' ' + val.deskripsi.slice(0, idx) + ' ' + val.deskripsi.slice(idx + nameLength);
                  }
                }
              } else if (splDesc.length === 4) {
                const deskripsi = splDesc.slice(1);
                const nama = splDesc[0];
                val.deskripsi = nama + ' ' + deskripsi.join(' ');
                val.deskripsi = val.deskripsi.replace(/\n/g, '');
                val.deskripsi = val.deskripsi.replace(/  /g, ' ');
              } else if (splDesc[0].includes('TANGGAL')) {

              }
              val.deskripsi = val.deskripsi.replace(/\n/g, '');
              val.deskripsi = val.deskripsi.replace(/  /g, ' ');
            }
          });
        }
        return value;
      });
      res.send(response.data);
    } else {
      res.send({ status: false, content: [], error: 'error.datanotfound' });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, error: error.stack });
  }
});

// OVO API
app.post('/ovo/login', ovoMiddleware, async (req, res, next) => {
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
});

app.post('/ovo/accesstoken', ovoMiddleware, async (req, res, next) => {
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
});

app.post('/ovo/confirmpin', ovoMiddleware, async (req, res, next) => {
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
});

app.post('/ovo/balance', ovoMiddleware, async (req, res, next) => {
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
});

app.post('/ovo/mutation', ovoMiddleware, async (req, res, next) => {
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
});

database.getConnection().then((database) => {
  console.log('Connected to database ' + database.config.database);
  app.listen(port, () => {
    console.log('Auto node is listening to port ' + port);
  });
}).catch(err => console.log(err));