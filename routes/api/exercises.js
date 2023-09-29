const express = require("express");
const router = express.Router();
const { schemas } = require("../../models/userExercise");
const { validateBody, auth } = require("../../middlewares");
const ctrl = require("../../controllers/exercises");
router.get("/", auth, ctrl.getAllExercises);
// router.get("/", auth, ctrl.getUserExercises);
// router.get("/", auth, ctrl.getExercisesByDate);
// router.get("/:id", auth, ctrl.getExercise);

router.delete("/", auth, ctrl.deleteExercise);
router.post(
  "/",
  auth,
  validateBody(schemas.addExerciseSchema),
  ctrl.createExercise
);
router.put(
  "/:id",
  auth,
  validateBody(schemas.updateExerciseSchema),
  ctrl.updateExercise
);

// from userExerc
router.get("/byDate", auth, ctrl.getExercisesByDate);

module.exports = router;
