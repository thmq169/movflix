const tmdbApi = require("../tmdb/tmdbApi");
const { error, success } = require("../handlers/reponse");

const getPersonDetail = async (req, res) => {
  try {
    const { personId } = req.params;

    const person = await tmdbApi.personDetail({ personId });

    success(res, person);
  } catch {
    error(res);
  }
};

const getPersonMedias = async (req, res) => {
  try {
    const { personId } = req.params;

    const medias = await tmdbApi.personMedia({ personId });

    success(res, medias);
  } catch {
    error(res);
  }
};

module.exports = {
  getPersonDetail,
  getPersonMedias,
};
