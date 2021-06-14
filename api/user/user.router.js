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
    SendMessageToUser,
    GetreviewCountbyUsername,
    CheckForEmail,
    VerifyOTPReset
} = require('./user.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");
const message_ratelimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 1, // start blocking after 5 requests
    message: "Too many accounts created from this IP, please try again after an hour"
});
const forgot_ratelimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 4, // start blocking after 5 requests
    message: "Too many accounts created from this IP, please try again after an hour",
    onLimitReached: function(req, res /*, next*/) {
        return res.status(200).json({
            status: "err",
            message: "Too many request in one hour window!"
        });
    },
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
router.get("/reviewusername/:username",GetreviewCountbyUsername);
router.post("/new-message/:id",SendMessageToUser);
router.get("/forgot/:email",forgot_ratelimit,CheckForEmail);
router.post("/verify-otp/:email",forgot_ratelimit,checkToken,VerifyOTPReset);
module.exports = router;