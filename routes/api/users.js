const express = require("express");
const router = express.Router();
const { schemas } = require("../../models/user");
// const { updateNameAvatarSchema } = require("../../models/user");
const { validateBody, auth } = require("../../middlewares");
const ctrl = require("../../controllers/users");
const ctrlUd = require("../../controllers/userData");
// const cloudCtrl = require('../../controllers/cloudinary')
// const bdExCtrl = require('../../controllers/exercises')
// const bdCtrl = require('../../controllers/filters')
const upload = require("../../middlewares/upload");

const { userDataSchemas } = require("../../models/user_data");

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrl.registerCtrl
);
router.post("/login", validateBody(schemas.loginSchema), ctrl.loginCtrl);
router.get("/current", auth, ctrl.getCurrentCtrl);
router.post("/logout", auth, ctrl.logoutCtrl);
// router.patch(
//   "/",
//   auth,
//   validateBody(userDataSchemas.updateUserSchema),
//   ctrl.updateUserCtrl
// );
// Оновлення імені і/або аватара користувача
// router.patch(
//   "/updateProfile",
//   auth,
//   validateBody(schemas.updateNameAvatarSchema),
//   // upload.single("avatar"),
//   ctrl.updateNameAvatarCtrl
// );

router.patch(
  "/updateProfile",
  auth,
  upload.single("avatarUrl"),
  validateBody(schemas.updateNameAvatarSchema),
  ctrl.updateNameAvatarCtrl
);

// router.patch(
//   "/updateProfile",
//   upload.single("avatar"),
//   ctrl.updateNameAvatarCtrl
// );
router.post(
  "/calculate",
  auth,
  validateBody(userDataSchemas.calculateSchema),
  ctrl.calculateNormsCtrl
);
// оновлення даних користувача
router.patch(
  "/updateParamsUser",
  auth,
  validateBody(userDataSchemas.updateParamsUserSchema),
  ctrl.updateParamsUserCtrl
);

// отримання даних корістувача
router.get("/userData", auth, ctrlUd.getAll);

// завантаж клоудінарі
// router.post('/cloudinary', cloudCtrl.onceUploadFilesAndChangeUrl);
// оновл в базі

// router.patch("/updateURL",  bdExCtrl.updateURL);
// router.patch("/updateURL",  bdCtrl.updateURL);

module.exports = router;
