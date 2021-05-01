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
        var u_default_profile_bg = 'https://prefetch.ratefreelancer.com/profile-bg/01.jpg';
        var u_default_profile_pic = 'https://prefetch.ratefreelancer.com/avatars/'+number+'.jpg';
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
                (error,results,fields) => {
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
                    if(data.login_type == "Google")
                    {
                        stripe.customers.create({
                            description : 'RateFreelancer customer',
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
                                }
                            )
                        })
                        .catch(error => console.error(error));
                        return callback(null,results)
                    }
                    else
                    {
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
                (error,results,fields) => {
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
                    if(data.login_type == "Google")
                    {
                        stripe.customers.create({
                            description : 'RateFreelancer customer',
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
                                }
                            )
                        })
                        .catch(error => console.error(error));
                        return callback(null,results)
                    }
                    else
                    {
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