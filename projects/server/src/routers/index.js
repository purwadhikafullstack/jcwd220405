const user = require("./userRouter");
const userProfile = require("./user_profile");
const userAddress = require("./user_address");
const admin = require("./adminRouter");

module.exports = {
  user,
  userProfile,
  userAddress,
  admin,
};
