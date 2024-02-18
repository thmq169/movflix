const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../handlers/request");
const { auth } = require("../middlewares/token");
const {
  getListReviewOfUser,
  createReview,
  removeReview,
} = require("../controllers/review");
const Review = require("../models/review");

const router = express.Router({ mergeParams: true });

router.get("/", auth, getListReviewOfUser);

router.post(
  "/",
  auth,
  body("mediaId")
    .exists()
    .withMessage("Media Id is required")
    .isLength({ min: 1 })
    .withMessage("Media Id cannot empty"),
  body("content")
    .exists()
    .withMessage("Content is required")
    .isLength({ min: 1 })
    .withMessage("Content cannot empty"),
  body("mediaType")
    .exists()
    .withMessage("Media type is required")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("Media type invalid"),
  body("mediaTitle").exists().withMessage("Media title is required"),
  body("mediaPoster").exists().withMessage("Media poster is required"),
  validate,
  createReview
);

router.delete("/:reviewId", auth, removeReview);

module.exports = router;
