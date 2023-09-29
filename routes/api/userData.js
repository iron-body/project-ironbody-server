const express = require("express");
const router = express.Router();
const { schemas } = require("../../models/user");
// const { updateNameAvatarSchema } = require("../../models/user");
const { validateBody, auth, upload } = require("../../middlewares");
const ctrl = require("../../controllers/userData");

router.get("/", auth, ctrl.getAll);

module.exports = router;
