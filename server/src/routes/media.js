const express = require("express");
const {
  search,
  getGenres,
  getMediaDetails,
  getList,
} = require("../controllers/media");

const router = express.Router({ mergeParams: true });

router.get("/search", search);

router.get("/genres", getGenres);

router.get("/detail/:mediaId", getMediaDetails);

router.get("/:mediaCategory", getList);

module.exports = router;
