const user = require("./userRouter");
const userProfile = require("./user_profile");
const userAddress = require("./user_address");
const admin = require("./adminRouter");
const orderList = require("./orderListRouter");
const rajaOngkir = require("./rajaOngkirRouter")

module.exports = {
  user,
  userProfile,
  userAddress,
  admin,
  orderList,
  rajaOngkir
};
