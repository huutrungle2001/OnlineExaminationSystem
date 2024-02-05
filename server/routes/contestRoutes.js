const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const { createContest, deleteContest } = require("../controllers/contest");
const { createFillInBlankQuest, deleteFillInBlankQuest } = require("../controllers/follInblank");
const { createMcqQuest, deleteMcqQuest } = require("../controllers/mcqQuest");
const router = express.Router();

router.post("/createContest", requireAuth.isHost, createContest);
router.delete("/:contestId", requireAuth.isHost, deleteContest);
router.post("/:contestId/fillInBlankQuest", requireAuth.isHost, createFillInBlankQuest)
router.delete("/:contestId/fillInBlankQuest/:fillInBlankQuestId",requireAuth.isHost, deleteFillInBlankQuest)
router.post("/:contestId/mcqQuest", requireAuth.isHost, createMcqQuest)
router.delete("/:contestId/mcqQuest/:mcqQuestId",requireAuth.isHost, deleteMcqQuest)

module.exports = router;
