const {
    GetMainCat,
    GetSubcat
} = require ('./cat.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");

router.get('/',checkToken,GetMainCat);
router.get('/subcat/:id',checkToken,GetSubcat);
module.exports = router;