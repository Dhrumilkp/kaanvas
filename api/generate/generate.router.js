const {
    GenerateUrl,
    GetCollectCount,
    GetCollectUrl
}= require('./generate.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken,checkPro} = require("../../auth/token_validation");

router.post("/new/:id",checkPro,checkToken,GenerateUrl);
router.get("/collectcount/:id",checkToken,GetCollectCount);
router.get("/collecturl/:id",checkToken,GetCollectUrl);
module.exports = router;