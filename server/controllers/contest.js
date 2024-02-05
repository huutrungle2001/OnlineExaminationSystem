const contest = require("../models/contest");
const fillInBlankQuest = require("../models/fillInBlank");
const mcqQuest = require("../models/mcqQuest");

const createContest = async (req, res) => {
    try {
        const {title, description, hostId} = req.body;
        const contestExists = await contest.exists({ title: title.toLowerCase() });
        if (contestExists) {
            return res.status(409).send("title already in use.");
        }
        const contestDoc = {
            title: title,
            description: description,
            hostId: hostId,
        };
        const contest = await contest.create(contestDoc);
        if (contestDoc) {
          return res.status(200).send("create contest successfully");
        } else {
          return res.status(500).send("Error occurred. Please try again");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error });
    }
}

const deleteContest = async (req, res) => {
    try {
        const { contestId } = req.params;
    
        const oldContest = await contest.findById(contestId);
        if (!oldContest) {
          return res.status(404).json({ success: false, message: "Contest not found" });
        }

        await fillInBlankQuest.deleteMany({ _id: { $in: contest.fillInBlankQuests } });

        await mcqQuest.deleteMany({ _id: { $in: contest.mcqQuests } });
    
        await contest.findOneAndDelete({ _id: contestId });

        return res.status(200).json({ success: true, message: "Contest and associated questions deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error });
    }
}
module.exports = {
    createContest,
    deleteContest
  };
  