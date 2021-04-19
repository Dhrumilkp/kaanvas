const pool = require("../../config/database");
const mailjet = require ('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");

module.exports = {
    reSendVerifyEmail : (email,callback) => {
        // Will resend email to the email in the body
        pool.query(
            `SELECT * FROM ka_user WHERE u_email = ?`,
            [
                email
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error)
                }
                var u_firstname = results[0].u_firstname;
                var u_lastname  = results[0].u_lastname;
            }
        )
        var secret = speakeasy.generateSecret({length: 20});
        var otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            digits:4,
            step: 60,
            window:10
        });
        pool.query(
            `UPDATE ka_emailvalidate SET u_otp =? WHERE u_email = ?`,
            [
                otp,
                email
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error)
                }
                // Send email with email template
                const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                    "Messages":[{
                        "From": {
                            "Email": "security-noreply@ratefreelancer.com",
                            "Name": "Ratefreelancer Security"
                        },
                        "To": [{
                            "Email": data.u_email,
                            "Name": data.u_firstname +' '+ data.u_lastname
                        }],
                        "Subject": otp +" is your verification otp for ratefreelancer",
                        "TextPart": "Hi "+data.u_firstname+" "+data.u_lastname+" "+otp+" is your verification otp use this in the next 6 minutes",
                        "HTMLPart": "<h1 style='font-color:#343a40;'>Welcome To RateFreelancer</h1><br>your verification otp is <b>"+otp+"</b>, use this otp to verify your email <br><br/> Cheers,<br>Ratefreelancer Team"
                    }]
                })
                request
                    .then((result) => {
                        console.log(result.body)
                    })
                    .catch((err) => {
                        console.log(err.statusCode)
                    })
            }
        )
    }
}