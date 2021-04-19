const { createUser,gcreateUser,increateUser } = require("./signup.controller");
const router = require("express").Router();
const rateLimit = require("express-rate-limit");

const Signuplimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Too many accounts created from this IP, please try again after an hour"
});

router.post("/",Signuplimiter,createUser);
router.post("/guser",Signuplimiter,gcreateUser);
router.post('/inuser',Signuplimiter,increateUser);

module.exports = router;