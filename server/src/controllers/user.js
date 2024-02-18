const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");
const {
  success,
  badRequest,
  created,
  error,
  unauthorize,
  notFound,
} = require("../handlers/reponse");

const signup = async (req, res) => {
  try {
    const { username, displayName, password } = req.body;

    const userChecked = await User.findOne({ username: username });

    if (userChecked) {
      return badRequest(res, "Username already used, try anothers.");
    }

    const newUser = new User();
    newUser.displayName = displayName;
    newUser.username = username;
    newUser.setPassword(password);

    await newUser.save();

    const token = jsonwebtoken.sign(
      { data: newUser._id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    created(res, {
      token,
      ...newUser._doc,
      id: newUser._id,
    });
  } catch {
    error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username }).select(
      "username password salt _id displayName"
    );

    if (!user) {
      return badRequest(res, "User not found");
    }

    if (!user.validPassword(password)) {
      return badRequest(res, "Wrong password");
    }

    const token = jsonwebtoken.sign(
      { data: user._id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    created(res, {
      token,
      ...user._doc,
      id: user._id,
    });
  } catch {
    error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("password salt _id");

    if (!user) return unauthorize(res);

    if (!user.validPassword(password)) return badRequest(res, "Wrong password");

    user.setPassword(newPassword);

    await user.save();

    success(res, user);
  } catch {
    error(res);
  }
};

const getUserInfor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return notFound(res);

    success(res, user);
  } catch {
    error(res);
  }
};

module.exports = {
  signin,
  signup,
  updatePassword,
  getUserInfor,
};
