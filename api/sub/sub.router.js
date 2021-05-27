const {
    CreateSub,
    GetSubdetails,
    CancelPro,
    CreatePaymentIntent
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
router.post("/payment_intent/:id",checkToken,CreatePaymentIntent);
router.get("/subscription-details/:customerid",checkToken,FetchInvoice,GetSubdetails);
router.post("/cancel-pro/:username",checkToken,CancelPro)
module.exports = router;