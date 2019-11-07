const express = require("express");
const IndexController = require("../controller/hello");

module.exports = app => {
  const Router = express.Router({ mergeParams: true });

  Router.route("/asdf").get(IndexController.get);

  return Router;
};
