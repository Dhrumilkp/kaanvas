const { GetUser } = require('./user.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");

const LoginrateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // start blocking after 5 requests
    message: "Too many login attemps, please try after sometime"
});

router.get("/:id",checkToken,LoginrateLimiter,GetUser);
module.exports = router;