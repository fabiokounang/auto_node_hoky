const Emoney = require("../models/master-emoney");

module.exports = async (req, res, next) => {
  try {
    const phone = req.body.phone;
    if (!phone) throw new Error('Nomor telepon wajib diisi');
    if (!phone.startsWith('+62')) throw new Error('Nomor telepon tidak valid (wajib +62)');
    if (phone.slice(1).length < 10 || phone.slice(1).length > 14) throw new Error('Nomor telepon tidak valid (10-14 digit)');

    const [dataOvo] = await Emoney.getDataByPhone(phone);
    if (dataOvo.length <= 0) throw new Error('Nomor telepon belum terdaftar');
    if (dataOvo[0].status_emoney != 1) throw new Error('Emoney saat ini sedang tidak aktif');
    if (req.url.includes('/login') && dataOvo[0].is_login >= 3 && dataOvo[0].auth_emoney) throw new Error('Nomor ini sudah login, silahkan mencoba untuk transaksi / logout kemudian relogin');
    req.dataOvo = dataOvo[0];
    // 0 belum login
    // 1 access token
    // 2 confirmpin
    // 3 loggedin
    next();
  } catch (error) {
    res.send({ status: false, error: [error.message] });
  }
}