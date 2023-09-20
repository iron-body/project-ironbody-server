const express = require("express");
const router = express.Router();
const { schemas } = require("../../models/product");
const { validateBody, auth } = require("../../middlewares");
const ctrl = require("../../controllers/products");
router.get("/", auth, ctrl.getAllProducts);
router.get("/:id", auth, ctrl.getProduct);
router.delete("/:id", auth, ctrl.deleteProduct);
router.post("/", auth, validateBody(schemas.addProductSchema));
router.patch("/:id", auth, validateBody(schemas.updateProductSchema));

module.exports = router;
