module.exports = {
  checkAuth: async (req, res) => {
    try {
      let token = req.headers.authorization
      console.log(token)

      next();
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
