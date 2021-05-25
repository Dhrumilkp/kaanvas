const pool = require("../../config/database");
const stripe = require('stripe')(process.env.STRIP_SK);
module.exports = {
    getUserByid : (id,callback) => {
        pool.query(
            `SELECT u_firstname,u_lastname,u_email,u_username,onboarding_status,mailverify_status,u_join,u_profilepic_webp,u_profilepic_jpeg,u_coverpic_webp,u_coverpic_jpeg,u_verified,u_country,u_city,is_profile_complete,u_level,is_pro,customer_id,u_website_url,u_dribbble_url,u_github_url,u_default_profile_pic,u_profile_bg_default,u_profile_bg,u_profile_bg_settings,u_profileroot_code FROM ka_user WHERE id = ?`,
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
                        `UPDATE ka_user SET u_firstname = ?, u_lastname = ?, u_username = ?, u_city = ?, u_country = ? WHERE id = ?`,
                        [
                            data.u_firstname,
                            data.u_lastname,
                            data.u_username,
                            data.u_city,
                            data.u_country,
                            data.u_uid  
                        ],
                        (error,results,fields) => {
                            if(error)
                            {
                                callback(error);
                            }
                            if(results)
                            {
                                pool.query(
                                    `UPDATE ka_user SET onboarding_status = ? WHERE id = ?`,
                                    [
                                        1,
                                        data.u_uid
                                    ],
                                    (error,results,fields) => {
                                        console.log(results[0]);
                                        if(error)
                                        {
                                            console.log(error);
                                        }
                                    }
                                )
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
            `SELECT id as u_uid,u_firstname,u_lastname,u_email,u_username,onboarding_status,mailverify_status,u_join,u_profilepic_webp,u_profilepic_jpeg,u_coverpic_webp,u_coverpic_jpeg,u_verified,u_country,u_city,is_profile_complete,u_level,is_pro,customer_id,u_website_url,u_dribbble_url,u_github_url,u_default_profile_pic,u_profile_bg_default,u_profile_bg,u_profile_bg_settings,u_profileroot_code FROM ka_user WHERE u_username = ?`,
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
    UpdateThemeForUser:(data,callback) => {
        pool.query(
            `UPDATE ka_user SET u_profileroot_code = ? WHERE id = ?`,
            [
                data.u_profileroot_code,
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
    PostMessageToUser:(body,callback) => {
        pool.query(
            `INSERT INTO ka_user_message (u_uid,project_title,project_details,project_budget,client_email,client_attachment) VALUES ?,?,?,?,?`,
            [
                body.u_uid,
                body.project_title,
                body.project_details,
                body.project_budget,
                body.client_email,
                body.client_attachment
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