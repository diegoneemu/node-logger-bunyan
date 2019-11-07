const bunyan = require("bunyan");

const reqSerializer = req => {
  return {
    method: req.method,
    path: req.path,
    ["query-string"]: req.params,
    ["user-agent"]: req["user-agent"]
  };
};

function MyRawStream() {}

MyRawStream.prototype.write = function(rec) {
  const { message } = rec;
  let formatString = "[%s] %s: %s --> %s | info: %s";

  if (message === "SEND_RESPONSE")
    formatString = "[%s] %s: %s -----> %s | info: %s";
  else if (message === "RECEIVE_REQUEST")
    formatString = "[%s] %s: %s ---> %s | info: %s";

  const contextMessage =
    rec.context && rec.context.message
      ? JSON.stringify(rec.context.message)
      : ``;

  const contextInfo =
    rec.context && rec.context.info ? JSON.stringify(rec.context.info) : ``;

  console.log(
    formatString,
    rec.time.toISOString(),
    bunyan.nameFromLevel[rec.level].toUpperCase(),
    rec.message,
    contextMessage,
    contextInfo
  );
};

const logger = bunyan.createLogger({
  src: true,
  name: "logger-app",
  serializers: {
    context: context => {
      const contextSerialized = {
        ...context
      };

      const req = context.req ? reqSerializer(context.req) : null;

      if (req) contextSerialized.req = reqSerializer(context.req);

      return contextSerialized;
    }
  },
  streams: [
    // {
    //   stream: process.stdout
    // },
    {
      level: "info",
      stream: new MyRawStream(),
      type: "raw"
    }
  ]
});

module.exports.info = logger.info.bind(logger);
module.exports.debug = logger.debug.bind(logger);
module.exports.warn = logger.debug.bind(logger);
module.exports.error = logger.debug.bind(logger);
module.exports.fatal = logger.fatal.bind(logger);
