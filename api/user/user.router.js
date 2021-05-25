const { 
    GetUser,
    UpdateUser,
    UpdateUserProfilePic,
    CheckProfileExsist,
    UploadNewProfileBg,
    UpdateProfileTheme,
    GetReferalSignupDate,
    InsertUniqueProfileView,
    GetUniqueViewCount,
    Getloginhistory,
    GetotalReviewCount,
    SendMessageToUser
} = require('./user.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");
const message_ratelimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 1, // start blocking after 5 requests
    message: "Too many accounts created from this IP, please try again after an hour"
});
router.get("/:id",checkToken,GetUser);
router.get("/profile/:username",CheckProfileExsist);
router.post("/basicprofileupdate/:id",checkToken,UpdateUser);
router.post("/profilepic/:id",checkToken,UpdateUserProfilePic);
router.post("/profile/bg/:id",checkToken,UploadNewProfileBg);
router.post("/profile/theme/:id",checkToken,UpdateProfileTheme);
router.post("/refdata/:username",checkToken,GetReferalSignupDate);
router.get("/profile/uniqueview/:username",InsertUniqueProfileView);
router.get("/profile/uniqueviewcount/:username",checkToken,GetUniqueViewCount);
router.get("/loginhistory/:username",checkToken,Getloginhistory);
router.get("/reviewcount/:id",checkToken,GetotalReviewCount);
router.post("/new-message/:username",message_ratelimit,SendMessageToUser);
module.exports = router;