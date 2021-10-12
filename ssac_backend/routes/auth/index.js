var express = require("express");
var router = express.Router();

const authModule = require("../../modules/authModule");
const authController = require("../../controllers/authController");

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.put("/profile", authModule.loggedIn, authController.updateProfile);
router.delete("/profile", authModule.loggedIn, authController.deleteProfile);

router.get("/profile", authModule.loggedIn, authController.getProfile);
// router.post(
//   "/images",
//   upload.single("img"),
//   authModule.loggedIn,
//   authController.uploadImage
// );

module.exports = router;
