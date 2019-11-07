const logger = require("../utils/logger");
var uuid = require("uuid");

module.exports = () => (req, res, next) => {
  const reqId = uuid.v4();

  logger.info({
    message: "RECEIVE_REQUEST",
    context: { ["request-id"]: reqId, req }
  });

  req.reqId = reqId;

  res.on("finish", err => {
    if (res.statusCode === 200) {
      logger.info({
        message: "SEND_RESPONSE",
        context: { ["request-id"]: reqId, req }
      });
      return;
    }
    if (res.statusCode >= 400 && res.statusCode < 500) {
      logger.warn({
        message: "SEND_RESPONSE",
        context: { ["request-id"]: reqId, req }
      });
    } else if (res.statusCode === 500) {
      logger.error({
        message: "SEND_RESPONSE",
        context: { ["request-id"]: reqId, req }
      });
    } else {
      logger.info({
        message: "SEND_RESPONSE",
        context: { ["request-id"]: reqId, req }
      });
    }
  });

  next();
};
