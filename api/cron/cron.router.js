const {
    UpdateCloudSyncFlag
} = require('./cron.controller');
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const {
    checkapi
} = require("../../auth/token_validation");
const runcronlimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 hour window
    max: 1, // start blocking after 5 requests
    message: "Cron job cannot run more then one day in a time"
});
router.get("/s3sync/:apikey",checkapi,runcronlimit,UpdateCloudSyncFlag);
module.exports = router;