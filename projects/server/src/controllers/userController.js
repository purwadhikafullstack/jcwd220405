const db = require("../../models");
const user = db.User;
const { Op } = require("sequelize");
const transporter = require("../helpers/transporter");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.OKAI_SECRET;


module.exports = {
  register: async (req, res) => {
    try {
      const { email } = req.body;

      const isEmailExist = await user.findOne({
        where: { email },
        raw: true,
      });
      if (isEmailExist) throw "Email have been used";
      
      const token = jwt.sign({ id: email }, key);
      await transporter.sendMail({
        from: "Admin",
        to: email,
        subject: "Verification Email",
        html: `<a href="http://localhost:3000/verification/${token}" target ="_blank"> Click here to verify </a>`,
      });

      await user.create({
        email,
      });

      res.status(200).send({
        message: "Please Check Your Email to Continue The Sign Up Proccess",
        email,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  setpass: async (req, res) => {
    try {
      const { email, password, confirmPassword, userName } = req.body;

      if (password != confirmPassword)
        throw "Confirmed password does not match!";

      if (password.length < 8) throw "Password contains minimal 8 character";

      const salt = await bcrypt.genSalt(10);

      const hashPass = await bcrypt.hash(password, salt);

      const data = await user.update(
        {
          password: hashPass,
          is_verified: true,
          role: 1,
          name: userName,

        },

        {
          where: {
            email: email,
          },
        }
      );

      res.status(200).send(data);
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },

  verification: async (req, res) => {
    try {
      const verify = jwt.verify(req.token, key);
      // console.log(verify);

      res.status(200).send({
        message: "Verification Test",
        user: verify.id,
      });
    } catch (err) {
      res.send(400).send(err);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const isUserExist = await user.findOne({
        where: {
          email: email ? email : "",
        },
        raw: true,
      });
      // console.log(isUserExist)
      if (!isUserExist) throw "User not Found!";

      const isValid = await bcrypt.compare(password, isUserExist.password);
      if (!isValid) throw "Wrong Password";

      const payload = {
        id: isUserExist.id,
        email: isUserExist.email,
        name: isUserExist.name,
      };
      const token = jwt.sign(payload, key);

      res
        .status(200)
        .send({ message: "Welcome to Mokomdo", token, isUserExist });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  keeplogin: async (req, res) => {
    try {
      // console.log(req.user);
      const isUserExist = await db.User.findOne({
        where: {
          id: req.user.id,
        },
        raw: true,
      });
      // console.log(isUserExist);

      res.status(200).send(isUserExist);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
