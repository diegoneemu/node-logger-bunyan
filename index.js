const http = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");
const resResLog = require("./middlewares/reqResLog");

const dirRoutes = path.join(__dirname, "routes");

const app = express();

app.use(resResLog());
app.use("/", (req, res) => {
  res.status(200).send("<h1>Hello World</h1>");
});

const port = 5000;

const server = http.Server(app);

server.listen(port, err => {
  if (err) {
    process.exit(1);
  }

  fs.readdirSync(dirRoutes).map(file => {
    const route = path.join(dirRoutes, file);

    const mRoute = require(route);

    logger.info({
      message: "APPLICATION_INFO",
      context: { message: "bla bla bla bla", info: { abc: "abc" } }
    });

    app.use("/api", mRoute(app));
  });
});
