const user = require("./userController");
const userProfile = require("./user_profile");
const userAddress = require("./user_address");
const admin = require("./adminController");
const orderList = require("./orderListController");

module.exports = {
  user,
  userProfile,
  userAddress,
  admin,
  orderList,
};
