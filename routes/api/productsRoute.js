const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/productsCtrl");

router.get("/", ctrl.productsFilter);

module.exports = router;
