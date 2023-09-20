const express = require("express");
const router = express.Router();
const { schemas } = require("../../models/exercise");
const { validateBody, auth } = require("../../middlewares");
const ctrl = require("../../controllers/exercises");
router.get("/", auth, ctrl.getAllExercises);
router.get("/:id", auth, ctrl.getExercise);
router.delete("/:id", auth, ctrl.deleteExercise);
router.post("/", auth, validateBody(schemas.addExerciseSchema));
router.patch("/:id", auth, validateBody(schemas.updateExerciseSchema));

module.exports = router;
