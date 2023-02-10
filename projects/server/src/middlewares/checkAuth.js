const jwt = require("jsonwebtoken");

module.exports = {
  checkAuth: async (req, res, next) => {
    try {
      let token = req.headers.authorization; //cara nerima bearer token

      
      if (!token) throw "your token is empty";
      
      token = token.split(" ")[1]; //untuk nge remove Bearer dari string
      
      if (token === "null" || !token) throw "Unauthorized Request";
      
      let verifiedUser = jwt.verify(token, process.env.OKAI_SECRET);
      
      if (!verifiedUser) throw "Verify token failed";
      
      if (verifiedUser.role === 1) {
        throw "Unauthorized Request Admin";
      }
      
      req.role = verifiedUser.role; //syntax bikin property dalam object

      next();
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
