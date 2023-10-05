const express = require("express");
const router = express.Router();
const { schemas } = require("../../models/exercise");
const { auth } = require("../../middlewares");
const ctrl = require("../../controllers/filters");
router.get("/", auth, ctrl.getAllFilters);
router.get("/filtered", auth, ctrl.getFilters);
// router.get("/", auth, ctrl.getUserExercises);
// router.get("/", auth, ctrl.getExercisesByDate);
// router.get("/:id", auth, ctrl.getExercise);
// router.delete("/", auth, ctrl.deleteExercise);
// router.post("/", auth, validateBody(schemas.addExerciseSchema), ctrl.createExercise);
// router.patch("/:id", auth, validateBody(schemas.updateExerciseSchema));

module.exports = router;