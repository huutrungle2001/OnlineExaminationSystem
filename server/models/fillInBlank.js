const mongoose = require("mongoose");
const fillInBlankQuestSchema = new mongoose.Schema(
    {
      contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contest",
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      numberRange: {
        type: Object,
        required: true,
      },
    }
  );
  module.exports = mongoose.model("FillInBlankQuest", fillInBlankQuestSchema);