const {
    CreateSub,
    GetSubdetails,
    CancelPro,
    CreatePaymentIntent,
    UpdateStripeCustomer,
    CreateNewSubscription
} = require('./sub.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {checkToken} = require("../../auth/token_validation");
const FetchInvoice = rateLimit({
    windowMs: 3000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Too many request, please dont abuse try after sometime!"
});
router.post("/profile/update/stripecustomer/:id",checkToken,UpdateStripeCustomer);
router.post("/create_new/:id",checkToken,CreateSub);
router.post("/payment_intent/:id",checkToken,CreatePaymentIntent);
router.get("/subscription-details/:customerid",checkToken,GetSubdetails);
router.post("/cancel-pro/:username",checkToken,CancelPro);
router.post("/new/:id",checkToken,CreateNewSubscription);
module.exports = router;