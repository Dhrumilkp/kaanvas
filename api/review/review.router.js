const {
    ReviewData,
    UpdateReviewData,
    GetallreviewUser,
    GetratingAvg,
    GetratingAvgbyusername,
    GetallTestimonial,
    GetReviewReaddata,
    GetallcountsUser,
    GetusersFolioData,
    GetallTestimonialUser
} = require('./review.controller');
const router = require("express").Router();
const {checkToken} = require("../../auth/token_validation");

router.get("/:id",ReviewData);
router.post("/update/:id",checkToken,UpdateReviewData);
router.get("/all/:username",GetallreviewUser);
router.get("/counts/:username",GetallcountsUser);
router.get("/ratingavg/:id",GetratingAvg);
router.get("/ratingavg-user/:username",GetratingAvgbyusername);
router.get("/gettestimonial/:username",GetallTestimonial);
router.get("/read/:id",GetReviewReaddata);
router.get("/folios/:username",GetusersFolioData);
router.get("/testi/:username",GetallTestimonialUser);
module.exports = router;