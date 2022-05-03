const express = require('express');
const router = express.Router();
const emoneycontroller = require('../controllers/emoney');
const { body } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const { checkCompany } = require('../middleware/check-user-type');

router.post('/', checkAuth, emoneycontroller.getAllEmoney);
router.post('/active', checkAuth, emoneycontroller.getAllEmoneyActive);
router.post('/create', checkCompany, [
  body('nama_emoney')
    .notEmpty().withMessage('Nama emoney wajib diisi')
    .isString().withMessage('Data tidak valid'),
  body('alias_emoney')
    .notEmpty().withMessage('Alias emoney wajib diisi')
    .isString().withMessage('Data tidak valid')
], checkAuth, emoneycontroller.createEmoney);

router.post('/update/:id', checkAuth, checkCompany, [
  body('nama_emoney')
    .notEmpty().withMessage('Nama emoney wajib diisi')
    .isString().withMessage('Data tidak valid'),
  body('alias_emoney')
    .notEmpty().withMessage('Alias emoney wajib diisi')
    .isString().withMessage('Data tidak valid'),
  body('status_emoney')
    .notEmpty().withMessage('Status emoney wajib diisi')
    .custom((value, { req }) => {
      if (value && ![1, 2].includes(value)) return false;
      return true;
    })
], checkAuth, emoneycontroller.updateEmoney);

module.exports = router;