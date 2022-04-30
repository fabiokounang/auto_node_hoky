const { validationResult } = require('express-validator');
const EmoneyUser = require('../models/master-emoney-user');

exports.getMutationOvo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error('Data request tidak valid');
    const [resultEmoneyPhone] = await EmoneyUser.getAllEmoneyAndPhone(req.body);
    return res.send({ status: true, data: resultEmoneyPhone });
  } catch (error) {
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}