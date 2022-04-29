const Emoney = require("../models/master-emoney");
const processQuery = require("../util/process-query");

exports.getAllEmoney = async (req, res, next) => {
  try {
    const queryData = processQuery(req.body);
    const [resultEmoney] = await Emoney.getAllEmoney(queryData.query);
    const [totalData] = await Emoney.getTotalEmoney(queryData.query);
    res.send({
      status: true,
      data: {
        page: queryData.page ? queryData.page == 0 ? 1 : queryData.page : 1,
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

    res.send({
      status: true
    });
  } catch (error) {
    res.send({
      status: false,
      error: [error.stack ? error.stack : error.response_message]
    });
  }
}