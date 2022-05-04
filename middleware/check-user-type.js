exports.checkCompany = (req, res, next) => {
  if (req.userType > 0) return res.send({ status: false, error: ['error.notauthorized'] });
  next();
}

exports.checkSuperadmin = (req, res, next) => {
  if (req.userType > 1) return res.send({ status: false, error: ['error.notauthorized'] });
  next();
}

exports.checkAdmin = (req, res, next) => {
  if (req.userType > 2) return res.send({ status: false, error: ['error.notauthorized'] });
  next();
}