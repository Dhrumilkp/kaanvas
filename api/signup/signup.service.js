const pool = require("../../config/database");
const mailjet = require ('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");
const stripe = require('stripe')(process.env.STRIP_SK);

module.exports = {
    create: (data,callback) => {
        const max = 50;
        const number = Math.floor(Math.random() * max) + 1;
        var u_default_profile_pic = 'https://prefetch.ratefreelancer.com/avatars/'+number+'.jpg';
        pool.query(
            // Your query
            `insert into ka_user(login_type,u_firstname,u_lastname,u_email,u_username,u_password,current_ip,current_useragent,u_default_profile_pic)
            values(?,?,?,?,?,?,?,?,?)
            `,
            [
              data.login_type,
              data.u_firstname,
              data.u_lastname,
              data.u_email,
              data.u_username,
              data.u_password,
              data.current_ip,
              data.current_useragent,
              u_default_profile_pic
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                // generate a token
                var secret = speakeasy.generateSecret({length: 20});
                var otp = speakeasy.totp({
                    secret: secret.base32,
                    encoding: 'base32',
                    digits:4,
                    step: 60,
                    window:10
                });
                pool.query(
                    `insert into ka_emailvalidate(u_email,u_otp)
                    value(?,?)`,
                    [
                        data.u_email,
                        otp
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
                                // create customer in stripe
                                let stripe_customer_id;
                                stripe.customers.create({
                                    description : 'RateFreelancer customer',
                                    name        : ''+data.u_firstname+' '+data.u_lastname+'',
                                    email       : data.u_email
                                })
                                .then(customer => {
                                    // Update the customer id of the user
                                    pool.query(
                                        `UPDATE ka_user SET customer_id = ?`,
                                        [
                                            customer.id
                                        ],
                                        (error,results,fields) => {
                                            if(error)
                                            {
                                                console.log(error);
                                            }
                                        }
                                    )
                                })
                                .catch(error => console.error(error));
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                );
                return callback(null,results)
            }
        );
    },
    // Check if user exists
    checkUser:(data,callback) => {
        pool.query(
            `select * from ka_user WHERE u_email = ?`,
            [data.u_email],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results[0]);
            }
        )
    },
    checkUsername:(data,callback) => {
        pool.query(
            `select * from ka_user where u_username = ?`,
            [
                data
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results[0]);
            }
        )
    }
};