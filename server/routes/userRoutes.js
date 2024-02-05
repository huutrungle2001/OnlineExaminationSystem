const express = require("express");
const {
  addRoleForUser,
  deleteUser,
} = require("../controllers/user.controller");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.post("/updateRole", requireAuth.isAdmin, addRoleForUser);
router.delete("/deleteUser", requireAuth.isAdmin, deleteUser);
module.exports = router;
