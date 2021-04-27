const { GetUser,UpdateUser,UpdateUserProfilePic,CheckProfileExsist,UploadNewProfileBg } = require('./user.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");

router.get("/:id",checkToken,GetUser);
router.get("/profile/:username",CheckProfileExsist);
router.post("/basicprofileupdate/:id",checkToken,UpdateUser);
router.post("/profilepic/:id",checkToken,UpdateUserProfilePic);
router.post("/profile/bg/:id",checkToken,UploadNewProfileBg);
module.exports = router;