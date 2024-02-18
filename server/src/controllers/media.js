const User = require("../models/user");
const Favorite = require("../models/favorite");
const Review = require("../models/review");
const tmdbApi = require("../tmdb/tmdbApi");
const { tokenDecode } = require("../middlewares/token");
const { error, success } = require("../handlers/reponse");

const getList = async (req, res) => {
  try {
    const { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    const response = await tmdbApi.mediaList({
      mediaType,
      mediaCategory,
      page,
    });

    return success(res, response);
  } catch {
    error(res);
  }
};

const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;

    const response = await tmdbApi.mediaGenres({ mediaType });

    return success(res, response);
  } catch (err) {
    error(res);
  }
};

const search = async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType,
    });

    success(res, response);
  } catch {
    error(res);
  }
};

const getMediaDetails = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    const params = { mediaType, mediaId };

    const media = await tmdbApi.mediaDetail(params);
    media.credits = await tmdbApi.mediaCredits(params);

    const videos = await tmdbApi.mediaVideos(params);
    media.videos = videos;

    const recommend = await tmdbApi.mediaRecommend(params);
    media.recommend = recommend.results;

    media.images = await tmdbApi.mediaImages(params);

    const token = tokenDecode(req);

    if (token) {
      const user = await User.findById(token.data);

      if (user) {
        const isFavorite = await Favorite.findOne({ user: user._id, mediaId });
        media.isFavorite = isFavorite !== null;
      }
    }

    media.reviews = await Review.find({ mediaId })
      .populate("user")
      .sort("-createdAt");

    success(res, media);
  } catch {
    error(res);
  }
};

module.exports = {
  getMediaDetails,
  getList,
  getGenres,
  search,
};
