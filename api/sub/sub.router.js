const {
    CreateSub,
    GetSubdetails
} = require('./sub.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");
const FetchInvoice = rateLimit({
    windowMs: 3000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Too many request, please dont abuse try after sometime!"
});
router.post("/create_new/:id",checkToken,CreateSub);
router.get("/subscription-details/:customerid",checkToken,FetchInvoice,GetSubdetails);
module.exports = router;