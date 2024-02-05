const mongoose = require("mongoose");

const hostSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contest",
        required: true,
      },
    }
  );

module.exports = mongoose.model("Host", hostSchema);
