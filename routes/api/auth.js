const express = require("express");
const router = express.Router();
const { schemas } = require("../../models/user");
// const { updateNameAvatarSchema } = require("../../models/user");
const { validateBody, auth, upload } = require("../../middlewares");
const ctrl = require("../../controllers/auth");
const { userDataSchemas } = require("../../models/user_data");

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrl.registerCtrl
);
router.post("/login", validateBody(schemas.loginSchema), ctrl.loginCtrl);
router.get("/current", auth, ctrl.getCurrentCtrl);
router.post("/logout", auth, ctrl.logoutCtrl);
router.patch(
  "/",
  auth,
  validateBody(userDataSchemas.updateUserSchema),
  ctrl.updateUserCtrl
);
// Оновлення імені і/або аватара користувача
router.patch(
  "/updateProfile",
  auth,
  validateBody(schemas.updateNameAvatarSchema),
  ctrl.updateNameAvatarCtrl
);
router.patch("/avatars", auth, upload.single("avatar"), ctrl.updateAvatarCtrl);

// оновлення даних користувача
router.patch(
  "/updateParamsUser",
  auth,
  validateBody(userDataSchemas.updateParamsUserSchema),
  ctrl.updateParamsUserCtrl
);

module.exports = router;
