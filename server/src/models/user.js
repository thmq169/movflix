const mongoose = require("mongoose");
const modelOptions = require("./modelOptions");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      required: true,
      select: false,
    },
  },
  modelOptions
);

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.password === hash;
};

module.exports = mongoose.model("User", userSchema);
