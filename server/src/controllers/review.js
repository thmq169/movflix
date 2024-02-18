const Review = require("../models/review");
const { created, error, notFound, success } = require("../handlers/reponse");

const createReview = async (req, res) => {
  try {
    const { movieId } = req.params;

    const review = await Review.create({
      user: req.user._id,
      movieId,
      ...req.body,
    });

    created(res, {
      ...review._doc,
      id: review._id,
      user: req.user,
    });
  } catch {
    error(res);
  }
};

const removeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId, user: req.user._id });

    if (!review) return notFound(res);

    await review.deleteOne();

    success(res);
  } catch {
    error(res);
  }
};

const getListReviewOfUser = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id,
    }).sort("-createdAt");

    success(res, reviews);
  } catch {
    error(res);
  }
};

module.exports = {
  createReview,
  removeReview,
  getListReviewOfUser,
};
