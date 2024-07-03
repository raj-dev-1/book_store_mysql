const { User } = require("../models/user.model");

const checkUser = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user ? user : false;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { checkUser };
