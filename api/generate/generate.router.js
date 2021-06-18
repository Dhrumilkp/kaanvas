const {
    GenerateUrl,
    GetCollectCount,
    GetCollectUrl,
    ReturnNature
}= require('./generate.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken,checkPro} = require("../../auth/token_validation");

router.post("/new/:id",checkPro,checkToken,GenerateUrl);
router.post("/checkpro/:id",checkPro,checkToken,ReturnNature);
router.get("/collectcount/:id",checkToken,GetCollectCount);
router.get("/collecturl/:id",checkToken,GetCollectUrl);
module.exports = router;