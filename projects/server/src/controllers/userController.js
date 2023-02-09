const fs = require("fs");
// const db = require("../../models");
const db = require("../models");
const user = db.User;
const { Op } = require("sequelize");
const transporter = require("../helpers/transporter");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.OKAI_SECRET;
const handlebars = require("handlebars");
const schedule = require("node-schedule");
const moment = require("moment");

const path = require("path");
const { FEURL_BASE } = process.env;

module.exports = {
  register: async (req, res) => {
    try {
      const { email } = req.body;
      const token = jwt.sign({ id: email }, key, {
        expiresIn: "24h",
      });

      const tempEmail = fs.readFileSync(
        path.resolve(__dirname, "../template/email.html"),
        "utf-8"
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        link: `${FEURL_BASE}/verification/${token}`,
      });

      await transporter.sendMail({
        from: "Admin",
        to: email,
        subject: "Verification Email",
        html: tempResult,
      });

      const registered = await user.create({
        email,
      });
      console.log(registered);

      const afterRegistered = moment()
        .add(24, "hours")
        .format("YYYY-MM-DD HH:mm:ss");

      schedule.scheduleJob(
        afterRegistered,
        async () =>
          await user.destroy({
            where: {
              id: registered.id,
            },
          })
      );

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
        picture: isUserExist.picture
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

      const cekVerified = await user.findOne({
        where: {
          email: email,
          is_verified: 1,
        },
      });

      if (!cekVerified) throw "No User Found";

      const token = jwt.sign({ id: email }, key, {
        expiresIn: "24h",
      });

      const tempEmail = fs.readFileSync(
        path.resolve(__dirname, "../template/password.html"),
        "utf-8"
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        link: `${FEURL_BASE}/resetpassword/${token}`,
      });

      await transporter.sendMail({
        from: "Admin",
        to: email,
        subject: "Reset Password Email",
        html: tempResult,
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
