require('dotenv').config()
const rateLimit = require("express-rate-limit");
const express = require('express');
var cors = require('cors');
const app = express();
const signupRouter = require("./api/signup/signup.router");
const loginRouter = require("./api/login/login.router");
const emailRouter = require("./api/email/email.router");
const getuserRoute = require("./api/user/user.router");
// SET JSON BODY AS DEFAULT
app.use(express.json());
app.use(cors({
    origin: process.env.FRONT_END_URL
}));
// SET RATE LIMITER DEFAULT FOR ALL API CALLS
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // limit each IP to 10 requests per windowMs,
    message : "You are doing this too much, excedding our rate limit quota please come back after sometime"
});  
app.use(limiter);
// SET JSON RESPONSE WHEN SOMEONE VISIT THE PAGE
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
// Port
const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});