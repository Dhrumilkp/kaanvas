require('dotenv').config()
const rateLimit = require("express-rate-limit");
const express = require('express');
var cors = require('cors');
const app = express();
const signupRouter = require("./api/signup/signup.router");
const loginRouter = require("./api/login/login.router");
const emailRouter = require("./api/email/email.router");
const getuserRoute = require("./api/user/user.router");
const SubRouter = require('./api/sub/sub.router');
const GenerateRouter = require('./api/generate/generate.router');
const GetCat = require('./api/cat/cat.router');
const ReviewRouter = require('./api/review/review.router');
// SET JSON BODY AS DEFAULT
app.use(express.json());
app.use(cors({
    origin: process.env.FRONT_END_URL
}));
// SET JSON RESPONSE WHEN SOMEONE VISIT THE PAGE
app.get("/",(req,res) =>{
    res.json({
        status      : "success",
        eventCode   :   "200",
        message     : "api framework working"
    }); 
});
app.get("/api",(req,res) =>{
    res.json({
        status      : "success",
        eventCode   :   "200",
        message     : "api framework working"
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
// Port
const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});