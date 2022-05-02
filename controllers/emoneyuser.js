const EmoneyUser = require("../models/master-emoney-user");
const processQueryEmoneyUser = require("../util/process-query-emoney-user");
const { validationResult } = require('express-validator');
const Emoney = require("../models/master-emoney");

exports.getAllEmoneyUser = async (req, res, next) => {
  try {
    const queryData = processQueryEmoneyUser(req.body);
    const [resultEmoney] = await Emoney.getAllEmoneyActive();
    const [resultEmoneyUser] = await EmoneyUser.getAllEmoneyUserByToko(queryData.query);
    const [totalData] = await EmoneyUser.getTotalEmoneyUser(queryData.query);
    res.send({
      status: true,
      data: {
        page: req.body.page ? req.body.page == 0 ? 1 : req.body.page : 1,
        limit: queryData.limit,
        max: totalData[0].total > 0 ? Math.ceil(totalData[0].total / queryData.limit) : 1,
        total: totalData[0].total,
        emoney: resultEmoney,
        values: resultEmoneyUser.map((value) => {
          value.showInput = false;
          if (value.auth_emoney) value.auth_emoney = JSON.parse(value.auth_emoney);
          return value;
        })
      }
    });
  } catch (error) {
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}

exports.getAllEmoneyAndPhone = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error('Data request tidak valid');
    const [resultEmoneyPhone] = await EmoneyUser.getAllPhoneByEmoney(req.body);
    return res.send({ status: true, data: resultEmoneyPhone });
  } catch (error) {
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}

exports.createEmoneyUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error('Data request tidak valid');
    const [emoney] = await Emoney.getEmoneyById(req.body.id_emoney);
    if (emoney.length <= 0) throw new Error('Emoney tidak terdaftar di sistem');
    if (emoney[0].status_emoney != 1) throw new Error('Emoney sedang tidak aktif');
    const [emoneyUser] = await EmoneyUser.getEmoneyByIdAndPhone(req.body.id_emoney, req.body.nomor_emoney);
    if (emoneyUser.length > 0) throw new Error('Nomor emoney user sudah tidak terdaftar di sistem');
    const objEmoneyUser = {
      "id_emoney": req.body.id_emoney,
      "nomor_emoney": req.body.nomor_emoney,
      "id_toko": req.body.id_toko
    }
    await EmoneyUser.createEmoneyUser(objEmoneyUser);
    res.send({
      status: true
    });
  } catch (error) {
    res.send({
      status: false,
      error: [error.message]
    });
  }
}

exports.updateEmoneyUser = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error('Data parameter tidak valid');
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error('Data request tidak valid');
    const [resultUpdate] = await EmoneyUser.updateEmoneyUser(req.body, req.params.id);
    res.send({
      status: true
    });
  } catch (error) {
    res.send({
      status: false,
      error: [error.message]
    });
  }
}