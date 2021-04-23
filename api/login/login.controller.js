const { checkuserExists,LoginUpdate,gloginauth } = require('./login.service');
const { compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
    login:(req,res) => {
        const body = req.body;
        const u_email = body.u_email;
        checkuserExists(u_email,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
                });
            }
            if(!results[0])
            {
                return res.status(404).json({
                    status : "err",
                    message : "Invalid email or password"
                });
            }
            const result = compareSync(body.u_password,results[0].u_password);
            if(result)
            {
                result.u_password = undefined;
                const jsontoken = sign({result:results},process.env.JWT_KEY,{
                    expiresIn: "1h"
                });
                if(results[0].mailverify_status == "0")
                {
                    results[0].email_verify_status = "false";
                }
                else
                {
                    results[0].email_verify_status = "true";
                }
                // Get users agent
                LoginUpdate(req.headers,(err,results) => {
                    if(err)
                    {
                        console.log(err);
                    }
                });
                return res.status(200).json({
                    status  :   "success",
                    message :   "Login successful",
                    token   :   jsontoken,
                    email_verify : results[0].email_verify_status,
                    onboarding_status : results[0].onboarding_status,
                    u_uid : results[0].id
                });
            }
            else
            {
                return res.status(500).json({
                    status  :   "err",
                    message :   "Invalid email or password"
                });
            }
        });
    },
    googleLogin:(req,res) => {
        const body = req.body;
        const payload =  client.verifyIdToken({
            idToken: body.token,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        let user = {};
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: body.token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            user.email = payload.email;
        }
        verify().then(() => {
            let u_email = user.email;
            gloginauth(u_email,(err,results) => {
                if(err)
                {
                    return res.status(500).json({
                        status: "err",
                        message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
                    }); 
                }
                if(!results[0])
                {
                    return res.status(404).json({
                        status : "err",
                        message : "Cannot find any account associated with this email!"
                    });
                }
                const jsontoken = sign({result:results},process.env.JWT_KEY,{
                    expiresIn: "1h"
                });
                if(results[0].mailverify_status == "0")
                {
                    results[0].email_verify_status = "false";
                }
                else
                {
                    results[0].email_verify_status = "true";
                }
                // Get users agent
                LoginUpdate(req.headers,(err,results) => {
                    if(err)
                    {
                        console.log(err);
                    }
                });
                return res.status(200).json({
                    status  :   "success",
                    message :   "Login successful",
                    token   :   jsontoken,
                    email_verify : results[0].email_verify_status,
                    onboarding_status : results[0].onboarding_status,
                    u_uid : results[0].id
                });
            });

        }).catch(console.error);
    }
}