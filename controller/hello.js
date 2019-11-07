module.exports = {
  get: (req, res) => {
    res.status(200).send("<h1>Hello World from Router</h1>");
  }
};
