const testResults = require("../models/testResults");
const FillInBlankQuest = require("../models/fillInBlank");
const MCQQuest = require("../models/mcqQuest");

const submit = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, contestId, answers } = req.body;

    console.log(userId, contestId, answers);

    if (!userId || !contestId || !answers) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required information" });
    }

    let totalScore = 0;
    for (const answer of answers) {
      if (answer.type === "mc") {
        const mcqQuestion = await MCQQuest.findById(answer.idQuestion);
        if (!mcqQuestion) {
          return res.status(404).json({
            success: false,
            message: `MCQ question with ID ${answer.idQuestion} not found`,
          });
        }

        if (answer.answer === mcqQuestion.correctOption) {
          totalScore += 1;
        }
      } else if (answer.type === "fill") {
        const fillQuestion = await FillInBlankQuest.findById(answer.idQuestion);
        if (!fillQuestion) {
          return res.status(404).json({
            success: false,
            message: `Fill In Blank question with ID ${answer.idQuestion} not found`,
          });
        }

        const lowerBound = fillQuestion.lowerBound;
        const upperBound = fillQuestion.upperBound;
        const userAnswer = parseFloat(answer.answer);
        if (
          !isNaN(userAnswer) &&
          userAnswer >= lowerBound &&
          userAnswer <= upperBound
        ) {
          totalScore += 1;
        }
      }
    }

    const newTestResult = new testResults({
      userId,
      contestId,
      answers,
      testScores: totalScore,
    });

    const savedTestResult = await newTestResult.save();

    return res.status(201).json({ success: true, data: savedTestResult });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

const getResultByContestId = async (req, res) => {
  try {
    const { contestId } = req.params;
    const result = await testResults
      .find({ contestId: contestId })
      .populate({ path: "userId", select: "-password -role" });
    if (result) {
      return res.status(200).json({ success: true, data: result });
    }
    return res
      .status(404)
      .json({ success: false, message: "Result contest not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};
module.exports = {
  submit,
  getResultByContestId,
};
