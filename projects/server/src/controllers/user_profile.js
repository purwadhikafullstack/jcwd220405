const db = require("../models");
const user = db.User;

const bcrypt = require("bcrypt");
const fs = require("fs");
const handlebars = require("handlebars");
const schedule = require("node-schedule");
const moment = require("moment");
const path = require("path");

const transporter = require("../helpers/transporter");
const { generateOTP } = require("../helpers/generateOTP");

const { FEURL_BASE } = process.env;

module.exports = {
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const response = await user.findOne({
        where: { id: id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
        raw: true,
      });
      return res.status(200).send(response);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  settingsProfile: async (req, res) => {
    try {
      const { id } = req.params;
      await user.update(req.body, {
        where: { id: id },
      });
      res.status(201).send({
        status: "Success",
        message: "Success update profile",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  checkPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { check } = req.body;

      const checkUser = await user.findOne({ where: { id: id }, raw: true });
      const isValid = await bcrypt.compare(check, checkUser.password);
      if (!isValid) throw "Incorrect password";

      res.status(200).send({
        status: isValid,
        message: "Success",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  sendOtp: async (req, res) => {
    try {
      const { id } = req.params;
      const OTP = generateOTP();
      const checkUser = await user.findOne({ where: { id: id }, raw: true });
      if (checkUser.otp) throw "Please check your email to verify";

      await user.update(
        {
          otp: OTP,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const tempEmail = fs.readFileSync(
        path.resolve(__dirname, "../template/otp.html"),
        "utf-8"
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        link: FEURL_BASE,
        button_link: `${FEURL_BASE}/profile/settings`,
        email: checkUser.email,
        otp: OTP,
      });

      await transporter.sendMail({
        from: "Admin",
        to: checkUser.email,
        subject: `Enter your verification OTP code ${OTP}`,
        html: tempResult,
      });

      const afterSend = moment()
        .add(15, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");

      schedule.scheduleJob(
        afterSend,
        async () =>
          await user.update(
            {
              otp: null,
            },
            {
              where: {
                id: id,
              },
            }
          )
      );
      res.status(200).send({
        status: "Success",
        message: "Success send OTP",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  signOtp: async (req, res) => {
    try {
      const { id } = req.params;
      const { check } = req.body;
      const checkUser = await user.findOne({ where: { id: id }, raw: true });

      if (checkUser.otp === +check) {
        await user.update(
          { is_verified: 1, otp: null },
          {
            where: { id: id },
          }
        );
      } else throw "Incorrect OTP";

      const tempEmail = fs.readFileSync(
        path.resolve(__dirname, "../template/verified.html"),
        "utf-8"
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        link: FEURL_BASE,
        email: checkUser.email,
      });

      await transporter.sendMail({
        from: "Admin",
        to: checkUser.email,
        subject: `CONGRATULATIONS`,
        html: tempResult,
      });

      res.status(200).send({
        message: "Success sign OTP",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  settingEmail: async (req, res) => {
    try {
      const { id } = req.params;
      const { email } = req.body;

      const checkEmail = await user.findOne({
        where: { email: email },
        raw: true,
      });
      if (checkEmail) throw "Email have been used";

      await user.update(
        { email: email, is_verified: 0 },
        {
          where: { id: id },
        }
      );

      res.status(201).send({
        status: "Success",
        message: "Success change email",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  uploadPicture: async (req, res) => {
    try {
      const { id } = req.params;
      let fileUploaded = req.file;

      await user.update(
        {
          picture: `/public/profile/${fileUploaded.filename}`,
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.status(201).send({
        status: "Success",
        message: "Success upload user image",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  settingPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword, newPasswordConfirmation } = req.body;

      const checkUser = await user.findOne({
        where: { id: id },
        raw: true,
      });
      const validPassword = await bcrypt.compare(
        oldPassword,
        checkUser.password
      );
      if (!validPassword) throw "Incorrect old password";
      if (oldPassword === newPassword) throw "Enter a new password";
      if (newPassword !== newPasswordConfirmation)
        throw "New Password doesnt match";

      const salt = await bcrypt.genSalt(10);
      const hassPassword = await bcrypt.hash(newPassword, salt);
      await user.update(
        { password: hassPassword },
        {
          where: {
            id: id,
          },
        }
      );

      const tempEmail = fs.readFileSync(
        path.resolve(__dirname, "../template/change-password.html"),
        "utf-8"
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        link: FEURL_BASE,
        email: checkUser.email,
      });
      await transporter.sendMail({
        from: "Admin",
        to: checkUser.email,
        subject: "Changed Password",
        html: tempResult,
      });

      res.status(201).send({
        status: "Success",
        message: "Success change password",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
};
