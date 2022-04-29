const Emoney = require("../models/master-emoney");
const processQueryEmoney = require("../util/process-query-emoney");
const { validationResult } = require('express-validator');

exports.getAllEmoney = async (req, res, next) => {
  try {
    const queryData = processQueryEmoney(req.body);
    const [resultEmoney] = await Emoney.getAllEmoney(queryData.query);
    const [totalData] = await Emoney.getTotalEmoney(queryData.query);
    res.send({
      status: true,
      data: {
        page: req.body.page ? req.body.page == 0 ? 1 : req.body.page : 1,
        limit: queryData.limit,
        max: totalData[0].total > 0 ? Math.ceil(totalData[0].total / queryData.limit) : 1,
        total: totalData[0].total,
        values: resultEmoney
      }
    });
  } catch (error) {
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}

exports.createEmoney = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error('Data request tidak valid');
    await Emoney.createEmoney(req.body);
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

exports.updateEmoney = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error('Data parameter tidak valid');
    const errors = validationResult(req);
    console.log(req.body)
    console.log(errors.array())
    if (!errors.isEmpty()) throw new Error('Data request tidak valid');
    await Emoney.updateEmoney(req.body, req.params.id);
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