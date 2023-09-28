const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares");
const ctrl = require("../../controllers/userData");

router.get("/", auth, ctrl.getAll);
module.exports = router;
