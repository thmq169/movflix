const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../handlers/request");
const User = require("../models/user");
const {
  getUserInfor,
  signin,
  signup,
  updatePassword,
} = require("../controllers/user");
const { auth } = require("../middlewares/token");
const {
  addFavorite,
  getFavoritesOfUser,
  removeFavorite,
} = require("../controllers/favorite");

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("Username is required")
    .isLength({ min: 8 })
    .withMessage("Username must be at least 8 characters")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) return Promise.reject("Username already exists");
    }),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword")
    .exists()
    .withMessage("Confirm password is required")
    .isLength({ min: 8 })
    .withMessage("Confirm password must be at least 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Confirm password does not match");
      return true;
    }),
  body("displayName")
    .isLength({ min: 6 })
    .withMessage("Display name must be at least 6 characters"),
  validate,
  signup
);

router.post(
  "/signin",
  body("username")
    .exists()
    .withMessage("Username is required")
    .isLength({ min: 8 })
    .withMessage("Username must be at least 8 characters"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validate,
  signin
);

router.put(
  "/update-password",
  auth,
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("newPassword")
    .exists()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
  body("confirmNewPassword")
    .exists()
    .withMessage("Confirm new password is required")
    .isLength({ min: 8 })
    .withMessage("Confirm new password must be at least 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error("New confirm password does not match");
      return true;
    }),
  validate,
  updatePassword
);

router.get("/info", auth, getUserInfor);

router.get("/favorites", auth, getFavoritesOfUser);

router.post(
  "/favorites",
  auth,
  body("mediaType")
    .exists()
    .withMessage("Media type is required")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("Media type invalid"),
  body("mediaId")
    .exists()
    .withMessage("Media Id is required")
    .isLength({ min: 1 })
    .withMessage("Media Id cannot be empty"),
  body("mediaTitle").exists().withMessage("Media title is required"),
  body("mediaPoster").exists().withMessage("Media poster is required"),
  body("mediaRate").exists().withMessage("Media rate is required"),
  validate,
  addFavorite
);

router.delete("/favorites/:favoriteId", auth, removeFavorite);

module.exports = router;
