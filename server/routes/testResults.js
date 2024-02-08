const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const { getResultByContestId, submit } = require("../controllers/result");
const router = express.Router();

router.post("/submit", requireAuth.requireAuth, submit);
router.get("/:contestId", requireAuth.isAdmin, getResultByContestId);
module.exports = router;
