const contest = require("../models/contest");
const fillInBlankQuest = require("../models/fillInBlank");
const fs = require("fs");

const createFillInBlankQuest = async (req, res) => {
  try {
    console.log(req.params, req.body);
    const { contestId } = req.params;
    const { question, numberRange } = req.body;

    const oldContest = await contest.findById(contestId);
    if (!oldContest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found" });
    }

    let imageBase64 = null;
    if (req.file) {
      const imageBuffer = fs.readFileSync(req.file.path);
      imageBase64 = imageBuffer.toString("base64");
      fs.unlinkSync(req.file.path);
    }

    const newFillInBlankQuest = await fillInBlankQuest.create({
      contestId,
      question,
      numberRange,
      imageBase64,
    });

    oldContest.fillInBlankQuests.push(newFillInBlankQuest._id);
    await oldContest.save();

    return res.status(200).json({
      success: true,
      message: "FillInBlankQuest created successfully",
      data: newFillInBlankQuest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

const deleteFillInBlankQuest = async (req, res) => {
  try {
    const { contestId, fillInBlankQuestId } = req.params;

    const oldContest = await contest.findById(contestId);
    if (!oldContest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found" });
    }

    // Check if the FillInBlankQuest exists in the contest
    const oldFillInBlankQuest = await fillInBlankQuest.findById(
      fillInBlankQuestId
    );
    if (!oldFillInBlankQuest) {
      return res
        .status(404)
        .json({ success: false, message: "FillInBlankQuest not found" });
    }

    // Remove the FillInBlankQuest from the contest's fillInBlankQuests array
    const index = oldContest.fillInBlankQuests.indexOf(fillInBlankQuestId);
    if (index > -1) {
      oldContest.fillInBlankQuests.splice(index, 1);
    }

    await oldContest.save();

    // Delete the FillInBlankQuest from the database
    await fillInBlankQuest.findByIdAndDelete(fillInBlankQuestId);

    return res.status(200).json({
      success: true,
      message: "FillInBlankQuest deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

const getFillInBlankQuestById = async () => {
  try {
    const { id } = req.params;

    const fillInBlankQuestData = await fillInBlankQuest.findById(id);
    if (!fillInBlankQuestData) {
      return res
        .status(404)
        .json({ success: false, message: "FillInBlankQuest not found" });
    }
    return res.status(200).json({ success: true, data: fillInBlankQuestData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

module.exports = {
  createFillInBlankQuest,
  deleteFillInBlankQuest,
  getFillInBlankQuestById,
};
