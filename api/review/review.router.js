const {
    ReviewData,
    UpdateReviewData,
    GetallreviewUser
} = require('./review.controller');
const router = require("express").Router();
const {checkToken} = require("../../auth/token_validation");

router.get("/:id",ReviewData);
router.post("/update/:id",checkToken,UpdateReviewData);
router.get("/all/:id",GetallreviewUser);
module.exports = router;