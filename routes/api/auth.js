const express = require('express');
const router = express.Router();
const { schemas } = require('../../models/user');
// const { updateNameAvatarSchema } = require("../../models/user");
const { validateBody, auth, upload } = require('../../middlewares');
const ctrl = require('../../controllers/auth');
const cors = require('cors');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.post('/register', validateBody(schemas.registerSchema), ctrl.registerCtrl);
router.post('/login', cors(corsOptions), validateBody(schemas.loginSchema), ctrl.loginCtrl);
router.get('/current', auth, ctrl.getCurrentCtrl);
router.post('/logout', auth, ctrl.logoutCtrl);
router.patch('/', auth, validateBody(schemas.updateUserSchema), ctrl.updateUserCtrl);
// Оновлення імені і/або аватара користувача
router.patch(
  '/updateProfile',
  auth,
  validateBody(schemas.updateNameAvatarSchema),
  ctrl.updateNameAvatarCtrl,
);
router.patch('/avatars', auth, upload.single('avatar'), ctrl.updateAvatarCtrl);

module.exports = router;
