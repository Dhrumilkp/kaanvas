const pool = require("../../config/database");
const mailjet = require ('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var uniqid = require('uniqid');
var speakeasy = require("speakeasy");
module.exports = {
    getUserByid : (id,callback) => {
        pool.query(
            `SELECT u_facebook_url,u_github_url,u_dribbble_url,u_instagram_url,u_linkedin_url,profile_theme_mode,per_hour,u_state,u_line2_add,u_line1_add,u_postal_code,u_country_iso,u_firstname,u_lastname,u_email,u_username,onboarding_status,mailverify_status,u_join,u_profilepic_webp,u_profilepic_jpeg,u_coverpic_webp,u_coverpic_jpeg,u_verified,u_country,u_city,is_profile_complete,u_level,is_pro,customer_id,u_website_url,u_dribbble_url,u_github_url,u_default_profile_pic,u_profile_bg_default,u_profile_bg,u_profile_bg_settings,u_profileroot_code FROM ka_user WHERE id = ?`,
            [
                id
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    Updateuserprofile:(data,callback) => {
        pool.query (
            `SELECT * FROM ka_user WHERE u_username = ? AND id != ?`,
            [
                data.u_username,
                data.u_uid
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                if(results[0])
                {
                    return callback(null,false);
                }
                if(!results[0])
                {
                    pool.query (
                        `UPDATE ka_user SET per_hour = ?, u_firstname = ?, u_lastname = ?, u_username = ?,u_state = ?, u_city = ?, u_country = ?, u_country_iso = ?,u_postal_code = ?,u_line1_add = ?, u_line2_add = ? WHERE id = ?`,
                        [
                            data.per_hour,
                            data.u_firstname,
                            data.u_lastname,
                            data.u_username,
                            data.u_state,
                            data.u_city,
                            data.u_country,
                            data.u_country_iso,
                            data.u_postal_code,
                            data.u_line1_add,
                            data.u_line2_add,
                            data.u_uid,
                        ],
                        (error,results,fields) => {
                            if(error)
                            {
                                callback(error);
                            }
                            return callback(null,results);
                        }
                    )
                }
            }
        ) 
    },
    UpdateProfilePic:(data,callback) => {
        pool.query(
            `UPDATE ka_user SET u_profilepic_webp = ?, u_profilepic_jpeg = ? WHERE id = ?`,
            [
                data.u_profilepic_webp,
                data.u_profilepic_jpeg,
                data.u_uid
            ],
            (error,results,fields) =>{
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    CheckForProfile:(data,callback) => {
        pool.query(
            `SELECT u_facebook_url,u_github_url,u_dribbble_url,u_instagram_url,u_linkedin_url,profile_theme_mode,per_hour,custom_rule,id as u_uid,u_firstname,u_lastname,u_email,u_username,onboarding_status,mailverify_status,u_join,u_profilepic_webp,u_profilepic_jpeg,u_coverpic_webp,u_coverpic_jpeg,u_verified,u_country,u_city,is_profile_complete,u_level,is_pro,customer_id,u_website_url,u_dribbble_url,u_github_url,u_default_profile_pic,u_profile_bg_default,u_profile_bg,u_profile_bg_settings,u_profileroot_code,tag_line FROM ka_user WHERE u_username = ?`,
            [
                data.username
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    UpdateNewProfileBg:(data,callback) => {
        pool.query(
            `UPDATE ka_user SET u_profile_bg = ? WHERE id = ?`,
            [
                data.u_profile_bg,
                data.u_uid
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    UpdateUsersCoverImageData:(data,callback) => {
        pool.query(
            `UPDATE ka_user SET u_profile_bg = ? WHERE id = ?`,
            [
                data.u_profile_bg,
                data.u_uid
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    UpdateThemeModeProfile:(data,callback) => {
        console.log(data);
        pool.query(
            `UPDATE ka_user SET profile_theme_mode = ? WHERE id = ?`,
            [
                data.theme_mode,
                data.u_uid
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    UpdateThemeForUser:(data,callback) => {
        pool.query(
            `UPDATE ka_user SET u_profileroot_code = ?,u_profile_bg = ?,tag_line = ?,custom_rule = ?,u_profile_bg_settings = ? WHERE id = ?`,
            [
                data.u_profileroot_code,
                data.cover_url,
                data.tag_line,
                data.custom_rule,
                data.custom_bg_rules,
                data.u_uid
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    GetReferalData:(data,callback) => {
        pool.query(
            `SELECT * FROM ka_user_referdata WHERE u_username = ?`,
            [
                data
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    GetPromoCouponCode:(data,callback) => {
        pool.query(
            `SELECT * FROM  ka_coupondata WHERE u_uid = ? AND is_used = ? LIMIT 3`,
            [
                data.u_uid,
                0
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                if(!results[0])
                {
                    // Create Coupon for the client
                    stripe.coupons.create({
                        percent_off: 100,
                        duration: 'repeating',
                        duration_in_months: 2,
                    })
                    .then(
                      coupon => {
                        pool.query(
                            `INSERT INTO ka_coupondata (u_uid,customer_id,coupon_id)
                            values(?,?,?)`,
                            [
                                data.u_uid,
                                data.customer_id,
                                coupon.id
                            ],
                            (error,results,fields) =>{
                                if(error)
                                {
                                    console.log(error);
                                }
                                return callback(null,coupon.id);
                            }
                        )
                      }  
                    )
                    .catch(
                        error => {
                            console.log(error);
                        } 
                    )
                }
                if(results[0])
                {
                    return callback(null,results[0].coupon_id);
                }
            }
        )
    },
    InsertUniqueProfileVisitor:(u_username,callback) => {
        pool.query(
            `INSERT INTO ka_userunique_visits (u_username) VALUES (?)`,
            [
                u_username
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    GetUniqueViewCountdata:(u_username,callback) => {
        pool.query(
            `SELECT count(*) as unique_counts FROM ka_userunique_visits WHERE u_username = ?`,
            [
                u_username
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    Getloginhistorydata:(u_username,callback) => {
        pool.query(
            `SELECT * FROM ka_usersessioninfo WHERE u_username = ? ORDER BY id DESC LIMIT 10`,
            [
                u_username
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    Getreviewdata:(u_uid,callback) => {
        pool.query(
            `SELECT count(*) as count_review FROM ka_collect_url WHERE u_uid = ? AND is_used = 1`,
            [
                u_uid
            ],
            (error,results,fields) =>{
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    GetReviewCount:(u_username,callback) => {
        pool.query(
            `SELECT id FROM ka_user WHERE u_username = ?`,
            [
                u_username
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                var u_uid = results[0]['id'];
                pool.query(
                    `SELECT count(*) as count_review FROM ka_collect_url WHERE u_uid = ? AND is_used = 1`,
                    [
                        u_uid
                    ],
                    (error,results,fields) =>{
                        if(error)
                        {
                            callback(error);
                        }
                        return callback(null,results);
                    }
                )
            }
        )
    },
    PostMessageToUser:(body,callback) => {
        pool.query(
            `INSERT INTO ka_user_message (u_uid,project_title,project_details,project_budget,client_name,client_email,client_attachment,created_on) VALUES (?,?,?,?,?,?,?,?)`,
            [
                body.u_uid,
                body.project_title,
                body.project_details,
                body.project_budget,
                body.client_name,
                body.client_email,
                body.client_attachment,
                body.created_on
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                pool.query(
                    `SELECT u_email,u_firstname,u_lastname FROM ka_user WHERE id = ?`,
                    [
                        body.u_uid
                    ],
                    (err,results,fields) => {
                        if(err)
                        {
                            callback(err);
                        }
                        var u_email = results[0]['u_email'];
                        var u_firstname = results[0]['u_firstname'];
                        var u_lastname = results[0]['u_lastname'];
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
                                            "Email": u_email,
                                            "Name": ""+u_firstname+" "+u_lastname+""
                                        }
                                    ],
                                    "TemplateID": 2950217,
                                    "TemplateLanguage": true,
                                    "Subject": "[[data:firstname:"+u_firstname+"]] , you have a new hire request",
                                    "Variables": {
                                        "project_title": body.project_title,
                                        "project_desc": body.project_details,
                                        "budget": "$"+body.project_budget+"",
                                        "client_name": body.client_name,
                                        "email_address": body.client_email
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
                    }
                )
                return callback(null,results);
            }
        )
    },
    CheckForEmailUser:(body,callback) => {
        pool.query(
            `SELECT * FROM ka_user WHERE u_email = ?`,
            [
                body
            ],
            (err,resultsuser,fields) => {
                if(err)
                {
                    callback(err);
                }
                var login_type = resultsuser[0]['login_type'];
                if(login_type == "Google")
                {
                    callback(null,false);
                }
                else
                {
                    var secret = speakeasy.generateSecret({length: 20});
                    var otp = speakeasy.totp({
                        secret: secret.base32,
                        encoding: 'base32',
                        digits:4,
                        step: 60,
                        window:10
                    });
                    pool.query(
                        `UPDATE ka_emailvalidate SET u_otp =?, is_used = ? WHERE u_email = ?`,
                        [
                            otp,
                            0,
                            body
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
                                        return callback(null,result.body);
                                    })
                                    .catch((err) => {
                                        return callback(err.statusCode);
                                    })
                            
                        }
                    );
                }
            }
        )
    },
    VerifyOtpwithEmail:(body,callback) => {
        pool.query(
            `SELECT * FROM ka_emailvalidate WHERE u_email = ? AND u_otp = ?`,
            [
                body.email,
                body.otp
            ],
            (err,results,fields) => {
                console.log(results);
                if(err)
                {
                    callback(err);
                }
                if(!results[0])
                {
                    return callback(null,false);
                }
                pool.query(
                    `UPDATE ka_emailvalidate SET is_used = ? WHERE u_email = ?`,
                    [
                        1,
                        body.email
                    ],
                    (err,results,fields) => {
                        if(err)
                        {
                            callback(err);
                        }
                        return callback(results)
                    }
                )
            }
        );
    },
    UpdateTagLineDb:(body,callback) => {
        pool.query(
            'UPDATE ka_user SET tag_line = ? WHERE u_username = ?',
            [
                body.tagline,
                body.username
            ],
            (err,results,fields) => {
                if(err)
                {
                    callback(err);
                }
                return callback(null,results);
            }
        )
    },
    UpdatePerHourCostDb:(body,callback) => {
        pool.query(
            'UPDATE ka_user SET per_hour = ? WHERE u_username = ?',
            [
                body.cost,
                body.username
            ],
            (err,results,fields) => {
                if(err)
                {
                    callback(err)
                }
                return callback(null,results);
            }
        )
    },
    CheckIfUserTrialIsDone:(username,callback) => {
        pool.query(
            'SELECT * FROM ka_user WHERE u_username = ?',
            [
                username 
            ],
            (err,results,fields) => {
                if(err)
                {
                    callback(err);
                }
                if(results)
                {
                    callback(null,results);
                }
            }
        )
    },
    UpdateUsersSocialProfilesdb:(body,callback) => {
        pool.query(
            'UPDATE ka_user SET u_linkedin_url = ? , u_facebook_url = ?, u_github_url = ?, u_dribbble_url = ?, u_instagram_url = ? WHERE u_username = ?',
            [
                body.linkedin,
                body.facebook,
                body.github,
                body.dribbble,
                body.instagram,
                body.username
            ],
            (err,results,fields) => {
                if(err){
                    callback(err);
                }
                return callback(null,results);
            }
        )
    }
}