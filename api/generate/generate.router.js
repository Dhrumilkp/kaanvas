const {
    GenerateUrl,
    GetCollectCount
}= require('./generate.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken,checkPro} = require("../../auth/token_validation");

router.post("/new/:id",checkToken,checkPro,GenerateUrl);
router.get("/collectcount/:id",checkToken,GetCollectCount);
module.exports = router;