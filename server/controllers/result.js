const testResults = require("../models/testResults");
const result = require("../models/testResults");

const submit = async (req, res) => {
  try {
    const { userId, contestId, answers } = req.body;
    
    if (!userId || !contestId || !answers) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required information" });
    }
    // viết hàm tính điểm các thứ ở đây rồi lưu vào newTestResult
    const newTestResult = new testResults({
      userId,
      contestId,
      answers,
      //number
    });

    // Lưu kết quả bài thi vào cơ sở dữ liệu
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
    const result = await result
      .find({ contestId: contestId })
      .populate({ path: "userId", select: "-password -role"});
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
