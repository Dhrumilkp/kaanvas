require('dotenv').config()
const rateLimit = require("express-rate-limit");
const express = require('express');
const app = express();
const signupRouter = require("./api/signup/signup.router");
const loginRouter = require("./api/login/login.router");
// SET JSON BODY AS DEFAULT
app.use(express.json());
// SET RATE LIMITER
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10 // limit each IP to 10 requests per windowMs,
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
// Port
const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});