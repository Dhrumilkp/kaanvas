require('dotenv').config()
const mysql = require('mysql');
const rateLimit = require("express-rate-limit");
const express = require('express');
const app = express();
const signupRouter = require("./api/signup/signup.router");
const loginRouter = require("./api/login/login.router");
const emailRouter = require("./api/email/email.router");
const getuserRoute = require("./api/user/user.router");
const SubRouter = require('./api/sub/sub.router');
const GenerateRouter = require('./api/generate/generate.router');
const GetCat = require('./api/cat/cat.router');
const ReviewRouter = require('./api/review/review.router');
const CronRouter = require('./api/cron/cron.router');
// SET JSON BODY AS DEFAULT
app.use(express.json());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://onelink.cards');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('accept-ranges','bytes');
    res.setHeader('content-type','application/json');
    res.setHeader('referrer-policy','origin-when-cross-origin');
    res.setHeader('referrer-policy','strict-origin-when-cross-origin');
    // Pass to next layer of middleware
    next();
});
// SET JSON RESPONSE WHEN SOMEONE VISIT THE PAGE
app.get("/",(req,res) =>{
    res.json({
        status      : "success",
        eventCode   : "200",
        message     : "api framework working",
        origins     : "Origins set",
        encrption   : "true"
    }); 
});
// Routes
app.use("/api/signup", signupRouter);
app.use("/api/login",loginRouter);
app.use("/api/email",emailRouter);
app.use("/api/user",getuserRoute);
app.use("/api/sub",SubRouter);
app.use("/api/gen",GenerateRouter);
app.use("/api/cat/",GetCat);
app.use("/api/review/",ReviewRouter);
app.use("/api/sync/",CronRouter);
// Port
const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});