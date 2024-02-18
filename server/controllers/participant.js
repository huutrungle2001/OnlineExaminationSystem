const User = require("../models/user");
const Contest = require("../models/contest");

const addUserToContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userIds = req.body;

    const contest = await Contest.findOneAndUpdate(
      { _id: contestId },
      { participant: userIds },
      { new: true }
    );

    if (!contest) {
      return res.status(404).json({ message: "Cuộc thi không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật danh sách người dùng trong cuộc thi thành công",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

const getAddedContest = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const contests = await Contest.find({ participant: { $in: [userId] } });

    res.status(200).json({ contests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

module.exports = {
  getAddedContest,
  addUserToContest,
};
