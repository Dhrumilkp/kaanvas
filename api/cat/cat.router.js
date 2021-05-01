const {
    GetMainCat
} = require ('./cat.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");

router.get('/',checkToken,GetMainCat);

module.exports = router;