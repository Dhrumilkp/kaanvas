const { reSendVerifyEmail,verifyEmailuser } = require('./email.service');
var speakeasy = require("speakeasy");

module.exports = {
    resendemail : (req,res) =>{
        const body = req.body;
        const u_email = body.u_email;
        reSendVerifyEmail(u_email,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            if(!results)
            {
                return res.status(404).json({
                    status: "err",
                    message: "Cannot find the email for which you are sending the request, reach out to support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                status: "success",
                data:results
            });
        });
    },
    verifyEmailOtp: (req,res) => {
        const body = req.body;
        verifyEmailuser(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            if(!results[0])
            {
                return res.status(404).json({
                    status: "err",
                    message: "Invalid OTP"
                });
            }
            return res.status(200).json({
                status: "success",
                email_verified_status : "true",
                redirect : "onboarding"
            });
        });
    }
};