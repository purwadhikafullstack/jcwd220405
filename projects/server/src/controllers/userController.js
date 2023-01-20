const fs = require("fs");
const db = require("../../models");
const user = db.User;
const { Op } = require("sequelize");
const transporter = require("../helpers/transporter");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.OKAI_SECRET;
const handlebars = require("handlebars");

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

      const tempEmail = fs.readFileSync("./src/template/email.html", "utf-8");
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        link: `http://localhost:3000/verification/${token}`,
      });

      await transporter.sendMail({
        from: "Admin",
        to: email,
        subject: "Verification Email",
        html: tempResult,
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
        role: isUserExist.role,
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
  emailResetPass: async (req, res) => {
    try {
      const { email } = req.body;

      const isEmailExist = await user.findOne({
        where: { email },
        raw: true,
      });

      if (!isEmailExist) throw "Email incorrect/not found";

      const token = jwt.sign({ id: email }, key);
      await transporter.sendMail({
        from: "Admin",
        to: email,
        subject: "Reset Password Email",
        html: `<a href="http://localhost:3000/resetpassword/${token}" target ="_blank"> Click here to reset your password </a>`,
      });

      res.status(200).send({
        message: "Please check your email to reset your password",
        email,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },
  resetpassword: async (req, res) => {
    try {
      const { email, password, confirmPassword } = req.body;

      if (password != confirmPassword)
        throw "Confirmed password does not match!";

      if (password.length < 8) throw "Password contains minimal 8 character";

      const salt = await bcrypt.genSalt(10);

      const hashPass = await bcrypt.hash(password, salt);

      const data = await user.update(
        {
          password: hashPass,
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
    }
  },
};
