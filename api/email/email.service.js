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
            (error,resultsuser,fields) => {
                if(error)
                {
                    callback(error);
                }
                if(!resultsuser)
                {
                    callback(error);
                }
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
                                "Messages":[
                                    {
                                        "From": {
                                            "Email": "supporty@onelink.cards",
                                            "Name": "Onelink.cards"
                                        },
                                        "To": [
                                            {
                                                "Email": resultsuser[0].u_email,
                                                "Name": resultsuser[0].u_firstname +' '+ resultsuser[0].u_lastname
                                            }
                                        ],
                                        "TemplateID": 2922706,
                                        "TemplateLanguage": true,
                                        "Subject": "[[data:firstname:"+resultsuser[0].u_firstname+"]] , your verification code is [[data:OTP:"+otp+"]]",
                                        "Variables": {
                                            "OTP": otp
                                        }
                                    }
                                ]
                            })
                            request
                                .then((result) => {
                                    console.log(result.body)
                                    return callback(null,result.body);
                                })
                                .catch((err) => {
                                    console.log(err.statusCode)
                                })
                        
                    }
                )
            }
        );   
    },
    verifyEmailuser: (data,callback) => {
        pool.query(
            `SELECT * FROM ka_emailvalidate WHERE u_email = ? AND u_otp = ? AND is_used = '0'`,
            [
                data.u_email,
                data.u_otp
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                if(results[0])
                {
                    pool.query(
                        `UPDATE ka_emailvalidate SET is_used = '1' WHERE u_email = ?`,
                        [
                            data.u_email
                        ],
                        (error,results,fields) => {
                            if(error)
                            {
                                callback(error);
                            }
                            pool.query(
                                `UPDATE ka_user SET mailverify_status = '1' WHERE u_email = ?`,
                                [
                                    data.u_email
                                ],
                                (error,results,fields) => {
                                    if(error)
                                    {
                                        callback(error);
                                    }
                                }
                            )
                        }
                    );
                }
                return callback(null,results);
            }
        );
    }
}