const pool = require("../../config/database");
const mailjet = require ('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");
const stripe = require('stripe')(process.env.STRIP_SK);

module.exports = {
    create: (data,callback) => {
        const max = 50;
        const number = Math.floor(Math.random() * max) + 1;
        const profile_bg_max = 5;
        const profile_number = Math.floor(Math.random() * profile_bg_max) + 1;
        var u_default_profile_bg = 'https://prefetch.onelink.cards/profile-bg/0d53d35edf512686b9eb65ccaef6b6a1.webp';
        var u_default_profile_pic = 'https://prefetch.onelink.cards/avatars/'+number+'.jpg';
        var bg_default_settings = 'background-size:cover;background-position:center;background-repeat:no-repeat;';
        const refuser = data.headers.refuser;
        const browser_data = data.headers.browsername;
        const os_data = data.headers.operatingsystem;
        if(data.login_type == "Google")
        {
            pool.query(
                // Your query
                `insert into ka_user(login_type,u_firstname,u_lastname,u_email,u_username,u_password,current_ip,current_useragent,u_default_profile_pic,u_profile_bg_default,u_profile_bg_settings,mailverify_status)
                values(?,?,?,?,?,?,?,?,?,?,?,?)
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
                  u_default_profile_pic,
                  u_default_profile_bg,
                  bg_default_settings,
                  1
                ],
                (error,newuserresult,fields) => {
                    if(error)
                    {
                        callback(error);
                    }
                    if(refuser !== "0")
                    {
                        pool.query(
                            `INSERT INTO ka_user_referdata (u_username,acq_u_username)
                            VALUES (?,?)`,
                            [
                                refuser,
                                data.u_username
                            ],
                            (error,results,fields) =>{
                                if(error)
                                {
                                    console.log(error);
                                }
                            }
                        )
                    }
                    pool.query(
                        `INSERT INTO ka_usersessioninfo (u_username,browser_name,operating_system)
                        values(?,?,?)
                        `,
                        [
                            data.u_username,
                            browser_data,
                            os_data
                        ],
                        (error,results,fields) => {
                            if(error)
                            {
                                console.log(error);
                            }
                        }
                    )
                    stripe.customers.create({
                        description : 'Onelink.cards customer',
                        name        : ''+data.u_firstname+' '+data.u_lastname+'',
                        email       : data.u_email
                    })
                    .then(customer => {
                        // Update the customer id of the user
                        pool.query(
                            `UPDATE ka_user SET customer_id = ? WHERE u_email = ?`,
                            [
                                customer.id,
                                data.u_email
                            ],
                            (error,results,fields) => {
                                if(error)
                                {
                                    console.log(error);
                                }
                                return callback(null,newuserresult);
                            }
                        )
                    })
                    .catch(error => console.error(error));
                }
            );
        }
        else
        {
            pool.query(
                // Your query
                `insert into ka_user(login_type,u_firstname,u_lastname,u_email,u_username,u_password,current_ip,current_useragent,u_default_profile_pic,u_profile_bg_default,u_profile_bg_settings,mailverify_status)
                values(?,?,?,?,?,?,?,?,?,?,?,?)
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
                  u_default_profile_pic,
                  u_default_profile_bg,
                  bg_default_settings,
                  0
                ],
                (error,newuserresult,fields) => {
                    if(error)
                    {
                        callback(error);
                    }
                    if(refuser !== "0")
                    {
                        pool.query(
                            `INSERT INTO ka_user_referdata (u_username,acq_u_username)
                            VALUES (?,?)`,
                            [
                                refuser,
                                data.u_username
                            ],
                            (error,results,fields) =>{
                                if(error)
                                {
                                    console.log(error);
                                }
                            }
                        )
                    }
                    pool.query(
                        `INSERT INTO ka_usersessioninfo (u_username,browser_name,operating_system)
                        values(?,?,?)
                        `,
                        [
                            data.u_username,
                            browser_data,
                            os_data
                        ],
                        (error,results,fields) => {
                            if(error)
                            {
                                console.log(error);
                            }
                        }
                    )   
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
                                "Messages":[
                                    {
                                        "From": {
                                            "Email": "security-noreply@onelink.cards",
                                            "Name": "Onelink.cards"
                                        },
                                        "To": [
                                            {
                                                "Email": data.u_email,
                                                "Name": data.u_firstname +' '+ data.u_lastname
                                            }
                                        ],
                                        "TemplateID": 2922706,
                                        "TemplateLanguage": true,
                                        "Subject": "[[data:firstname:"+data.u_firstname+"]] , your verification code is [[data:OTP:"+otp+"]]",
                                        "Variables": {
                            "OTP": otp
                            }
                                    }
                                ]
                            })
                        request
                            .then((result) => {
                                const request = mailjet
                                .post("send", {'version': 'v3.1'})
                                .request({
                                    "Messages":[
                                        {
                                            "From": {
                                                "Email": "support@onelink.cards",
                                                "Name": "Onelink.cards"
                                            },
                                            "To": [
                                                {
                                                    "Email": data.u_email,
                                                    "Name": data.u_firstname +' '+ data.u_lastname
                                                }
                                            ],
                                            "TemplateID": 2922728,
                                            "TemplateLanguage": true,
                                            "Subject": "[[data:firstname:"+data.u_firstname+"]],Welcome to onelink.cards Family",
                                            "Variables": {
                                                "firstname": data.u_firstname
                                            }
                                        }
                                    ]
                                })
                                request
                                    .then((result) => {
                                        console.log(result.body)
                                    })
                                    .catch((err) => {
                                        console.log(err.statusCode)
                                    })
                                //create customer in stripe
                                let stripe_customer_id;
                                stripe.customers.create({
                                    description : 'Onelink customer',
                                    name        : ''+data.u_firstname+' '+data.u_lastname+'',
                                    email       : data.u_email
                                })
                                .then(customer => {
                                    // Update the customer id of the user
                                    pool.query(
                                        `UPDATE ka_user SET customer_id = ? WHERE u_email = ?`,
                                        [
                                            customer.id,
                                            data.u_email
                                        ],
                                        (error,results,fields) => {
                                            if(error)
                                            {
                                                console.log(error);
                                            }
                                            return callback(null,newuserresult)
                                        }
                                    )
                                })
                                .catch(error => console.error(error));
                            })
                            .catch((err) => {
                                console.log(err.statusCode)
                            })
                        }
                    );    
                }
            );
        }

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
    }
};