const express = require("express");
const userRouter = require("./users");
const mediaRouter = require("./media");
const personRouter = require("./person");
const reviewRouter = require("./review");

const router = express.Router();

router.use("/user", userRouter);
router.use("/person", personRouter);
router.use("/reviews", reviewRouter);
router.use("/:mediaType", mediaRouter);

module.exports = router;
