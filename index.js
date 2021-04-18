require('dotenv').config()
const express = require('express');
const app = express();
const signupRouter = require("./api/signup/signup.router");
// Routes
app.use(express.json());
app.get("/api",(req,res) =>{
    res.json({
        status      : "success",
        eventCode   :   "200",
        message     : "api framework working"
    }); 
});
app.use("/api/signup", signupRouter);
// Port
const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});