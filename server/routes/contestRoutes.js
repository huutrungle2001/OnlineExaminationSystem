const express = require("express");
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG files are allowed"));
    }
  },
});

const requireAuth = require("../middlewares/requireAuth");
const {
  createContest,
  deleteContest,
  getContestById,
  getAllContest,
} = require("../controllers/contest");
const {
  createFillInBlankQuest,
  deleteFillInBlankQuest,
} = require("../controllers/follInblank");
const { createMcqQuest, deleteMcqQuest } = require("../controllers/mcqQuest");
const router = express.Router();

router.get("/getAll", requireAuth.isHostOrAdmin, getAllContest);
router.get("/:contestId", requireAuth.isHostOrAdmin, getContestById);
router.post("/create", requireAuth.isHostOrAdmin, createContest);
router.delete("/:contestId", requireAuth.isHostOrAdmin, deleteContest);
router.post(
  "/:contestId/fillInBlankQuest",
  upload.single("image"),
  requireAuth.isHostOrAdmin,
  createFillInBlankQuest
);
router.delete(
  "/:contestId/fillInBlankQuest/:fillInBlankQuestId",
  requireAuth.isHostOrAdmin,
  deleteFillInBlankQuest
);
router.post(
  "/:contestId/mcqQuest",
  upload.single("image"),
  requireAuth.isHostOrAdmin,
  createMcqQuest
);
router.delete(
  "/:contestId/mcqQuest/:mcqQuestId",
  requireAuth.isHostOrAdmin,
  deleteMcqQuest
);

module.exports = router;
