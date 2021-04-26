const { GetUser,UpdateUser,UpdateUserProfilePic,UpdateDefaultProfilepic } = require('./user.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");

router.get("/:id",checkToken,GetUser);
router.post("/basicprofileupdate/:id",checkToken,UpdateUser);
router.post("/profilepic/:id",checkToken,UpdateUserProfilePic);
module.exports = router;