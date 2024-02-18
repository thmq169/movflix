const express = require("express");
const { getPersonDetail, getPersonMedias } = require("../controllers/person");

const router = express.Router({ mergeParams: true });

router.get("/:personId/medias", getPersonMedias);

router.get("/:personId", getPersonDetail);

module.exports = router;
