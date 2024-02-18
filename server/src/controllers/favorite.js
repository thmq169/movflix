const Favorite = require("../models/favorite");
const { created, error, notFound, success } = require("../handlers/reponse");

const addFavorite = async (req, res) => {
  try {
    const isFavorite = await Favorite.findOne({
      user: req.user._id,
      mediaId: req.body.mediaId,
    });

    if (isFavorite) return success(res, isFavorite);

    const favorite = await Favorite.create({
      ...req.body,
      user: req.user._id,
    });

    created(res, favorite);
  } catch (err) {
    console.log(err);
    error(res);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user._id,
      _id: favoriteId,
    });

    if (!favorite) return notFound(res);

    await favorite.deleteOne();

    success(res);
  } catch (err) {
    console.log(err);
    error(res);
  }
};

const getFavoritesOfUser = async (req, res) => {
  try {
    const listFavorite = await Favorite.find({
      user: req.user._id,
    }).sort("-createdAt");

    success(res, listFavorite);
  } catch {
    error(res);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesOfUser,
};
