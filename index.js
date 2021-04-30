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
// SET JSON BODY AS DEFAULT
app.use(express.json());
app.use(cors({
    origin: process.env.FRONT_END_URL
}));
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
app.use("/api/sub",SubRouter);
app.use("/api/gen",GenerateRouter);
// Port
const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});