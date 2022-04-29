const Emoney = require("../models/master-emoney");

module.exports = async (req, res, next) => {
  try {
    const phone = req.body.phone;
    if (!phone) throw new Error('Phone required');
    if (!phone.startsWith('+62')) throw new Error('Phone not valid');
    if (phone.slice(1).length < 10 || phone.slice(1).length > 14) throw new Error('Phone length not valid');

    const [dataOvo] = await Emoney.getDataByPhone(phone);
    if (dataOvo.length <= 0) throw new Error('Phone not registered');
    if (req.url.includes('/login') && dataOvo[0].is_login == 1 && dataOvo[0].auth_emoney) throw new Error('This phone number is already logged in, please proceed to transactions');
    req.dataOvo = dataOvo[0];
    next();
  } catch (error) {
    res.send({ status: false, error: error.stack });
  }
}