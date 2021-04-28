const {
    CreateSub
} = require('./sub.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");

router.post("/create_new/:id",checkToken,CreateSub);

module.exports = router;