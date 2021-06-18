const {
    GetallinboxMessage
} = require('./inbox.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken,checkPro} = require("../../auth/token_validation");

router.get("/all/:id",checkToken,GetallinboxMessage);
module.exports = router;