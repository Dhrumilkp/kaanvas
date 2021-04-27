const { 
    GetUser,
    UpdateUser,
    UpdateUserProfilePic,
    CheckProfileExsist,
    UploadNewProfileBg,
    UpdateProfileTheme,
    GetReferalSignupDate,
    InsertUniqueProfileView
} = require('./user.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");

router.get("/:id",checkToken,GetUser);
router.get("/profile/:username",CheckProfileExsist);
router.post("/basicprofileupdate/:id",checkToken,UpdateUser);
router.post("/profilepic/:id",checkToken,UpdateUserProfilePic);
router.post("/profile/bg/:id",checkToken,UploadNewProfileBg);
router.post("/profile/theme/:id",checkToken,UpdateProfileTheme);
router.post("/refdata/:username",checkToken,GetReferalSignupDate);
router.get("/profile/uniqueview/:username",InsertUniqueProfileView);
module.exports = router;