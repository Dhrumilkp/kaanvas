const { resendemail } = require('./email.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");

const ResendEmailLimit = rateLimit({
    windowMs: 60 * 1000, // 1 hour window
    max: 3, // start blocking after 5 requests
    message: "Too many resend email otp request, try after sometime!"
});

router.post("/",checkToken,ResendEmailLimit,resendemail);
module.exports = router;
