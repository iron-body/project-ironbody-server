const express = require("express");
const router = express.Router();
const { productsFilter } = require("../../controllers/productsCtrl");
const { schemas } = require("../../models/productModel");

const ctrl = require("../../controllers/productsCtrl");

router.get("/", ctrl.productsFilter);

module.exports = router;
