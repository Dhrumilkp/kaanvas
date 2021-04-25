const { login,googleLogin } = require('./login.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");

const LoginrateLimiter = rateLimit({
    windowMs: 5000, // 1 hour window
    max: 10, // start blocking after 5 requests
    message: "Too many login attemps, please try after sometime"
});

router.post("/",LoginrateLimiter,login);
router.post("/glogin",LoginrateLimiter,googleLogin)
module.exports = router;