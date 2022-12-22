const db = require("../../models");
const user = db.User;
const bcrypt = require("bcrypt");

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
      console.error(error);
      return res.status(404).send(error);
    }
  },
  settingsProfile: async (req, res) => {
    try {
      await user.update(req.body, {
        where: { id: req.params.id },
      });
      res.status(201).send({
        status: "Success",
        message: "Success update profile",
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  settingEmail: async (req, res) => {
    try {
      const { email } = req.body;

      const checkEmail = await user.findOne({
        where: { email: email },
        raw: true,
      });
      if (checkEmail) throw "Email have been used";

      await user.update(
        { email: email, is_verified: 0 },
        {
          where: { id: req.params.id },
        }
      );

      res.status(201).send({
        status: "Success",
        message: "Success change email",
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  uploadPicture: async (req, res) => {
    try {
      let fileUploaded = req.file;

      await user.update(
        {
          picture: `/public/profile/${fileUploaded.filename}`,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(201).send({
        status: "Success",
        message: "Success upload user image",
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  settingPassword: async (req, res) => {
    try {
      const { oldPassword, newPassword, newPasswordConfirmation } = req.body;

      const checkUser = await user.findOne({
        where: { id: req.params.id },
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
            id: req.params.id,
          },
        }
      );

      res.status(201).send({
        status: "Success",
        message: "Success change password",
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
};
