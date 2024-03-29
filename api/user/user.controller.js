const { 
    getUserByid,
    Updateuserprofile,
    UpdateProfilePic,
    CheckForProfile,
    UpdateNewProfileBg,
    UpdateThemeForUser,
    GetReferalData,
    GetPromoCouponCode,
    InsertUniqueProfileVisitor,
    GetUniqueViewCountdata,
    Getloginhistorydata,
    Getreviewdata,
    PostMessageToUser,
    GetReviewCount,
    CheckForEmailUser,
    VerifyOtpwithEmail,
    UpdateUsersCoverImageData,
    UpdateThemeModeProfile,
    UpdateTagLineDb,
    CheckIfUserTrialIsDone,
    UpdatePerHourCostDb,
    UpdateUsersSocialProfilesdb
} = require("./user.service");
const stripe = require('stripe')(process.env.STRIP_SK);
const { sign } = require("jsonwebtoken");
module.exports = {
    GetUser:(req,res) => {
        const body = req.body;
        const id = req.params.id;
        getUserByid(id,(err,results) => {
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
                    message: "No such user found"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "User data fetch success",
                data   :   results
            });
        });
    },
    UpdateUser:(req,res) => {
        const body = req.body;
        const id = req.params.id;
        body.u_uid = id;
        // Stripe update users address 
        stripe.customers.update(
            body.customer_id,
            {
                address: {
                    line1: body.u_line1_add,
                    line2: body.u_line2_add,
                    postal_code: body.u_postal_code,
                    city: body.u_city,
                    state: body.u_state,
                    country: body.u_country_iso,                    
                }
            }
        )
        .then(
            result => {
               console.log(result);
            }
        )
        .catch(
            error => {
                return res.status(500).json({
                    status: "err",
                    erorreport : error,
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
        )
        var username = body.u_username;
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(format.test(username)){
            return res.status(500).json({
                status: "err",
                message: "Username cannot have any special character"
            });
        } else {
            Updateuserprofile(body,(err,results) => {
                if(err)
                {
                    return res.status(500).json({
                        status: "err",
                        erorreport : err,
                        message: "Internal server err, please reach out to our support team on support@onelink.cards"
                    });
                }
                if(results == false)
                {
                    return res.status(500).json({
                        status: "err",
                        message: "Username already taken!"
                    });
                }
                return res.status(200).json({
                    status  :   "success",
                    message :   "Users data updated",
                    data   :    body
                });
            });
        }
    },
    UpdateUserProfilePic:(req,res) => {
        const body = req.body;
        const id = req.params.id;
        body.u_uid = id;
        UpdateProfilePic(body,(err,results)=> {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Profile picture updated"
            });
        });
    },
    UpdateUsersCoverImg:(req,res) => {
        const body = req.body;
        const id = req.params.id;
        body.u_uid = id;
        UpdateUsersCoverImageData(body,(err,results)=> {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Cover picture updated"
            });
        });
    },
    ChangeThemeMode:(req,res) => {
        const body = req.body;
        const id = req.params.id;
        body.u_uid = id;
        UpdateThemeModeProfile(body,(err,results)=> {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Theme Updated"
            });
        });
    },
    CheckProfileExsist:(req,res) => {
        const body = req.body;
        const username = req.params.username;
        body.username = username;
        CheckForProfile(body,(err,results) => {
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
                    message: "Profile not found"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Profile found",
                data : results[0]
            });
        });
    },
    UploadNewProfileBg :(req,res) => {
        const body = req.body;
        const id = req.params.id;
        body.u_uid = id;
        UpdateNewProfileBg(body,(err,results) => {
            console.log(results);
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
                    message: "Profile not found"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Profile Bg Updated"
            });
        });
    },
    VerifyOTPReset:(req,res) => {
        const u_email = req.params.email;
        const body = req.body;
        body.u_email = u_email;
        VerifyOtpwithEmail(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards",
                    err_code : err
                });
            }
            if(results == false)
            {
                return res.status(200).json({
                    status: "err",
                    message: "Wrong otp!"
                });
            }
            const jsontoken = sign({result:results},process.env.JWT_KEY,{
                expiresIn: "1h"
            });
            return res.status(200).json({
                status  :   "success",
                message :   "OTP verified set new password!",
                temp_token : jsontoken
            });
        });
    },
    CheckForEmail:(req,res) => {
        const u_email = req.params.email;
        CheckForEmailUser(u_email,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            if(!results)
            {
                return res.status(200).json({
                    status: "err",
                    message: "No accounts associated with this email address found"
                });  
            }
            if(results == false)
            {
                return res.status(200).json({
                    status: "err",
                    message: "This email uses google login as the primary authentication method, login with google to access your account"
                });
            }
            const jsontoken = sign({result:results},process.env.JWT_KEY,{
                expiresIn: "1h"
            });
            return res.status(200).json({
                status  :   "success",
                message :   "Verification otp sent, expires in 1 minutes",
                response_json : results,
                temp_token : jsontoken,
                email_to_verify: u_email
            });
        });
    },
    UpdateProfileTheme:(req,res) => {
        const body = req.body;
        const id = req.params.id;
        body.u_uid = id;
        UpdateThemeForUser(body,(err,results) => {
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
                    message: "Profile not found"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Profile Theme Updated"
            });
        });
    },
    GetReferalSignupDate:(req,res) => {
        const body = req.body;
        const u_username = req.params.username;
        GetReferalData(u_username,(err,results) => {
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
                    message: "Profile not found"
                });
            }
            if(results.length > 2)
            {
                GetPromoCouponCode(body,(err,coupondata) => {
                    if(err)
                    {
                        return res.status(500).json({
                            status: "err",
                            message: "Internal server err, please reach out to our support team on support@onelink.cards"
                        });
                    }
                    return res.status(200).json({
                        status  :   "success",
                        message :   "Fetched user ref list",
                        ref_signup_count : results.length,
                        coupon_gen : "true",
                        coupon_id : coupondata
                    });
                });
            }
            else
            {
                return res.status(200).json({
                    status  :   "success",
                    message :   "Fetched user ref list",
                    data : results,
                    ref_signup_count : results.length
                });
            }
           
        });
    },
    InsertUniqueProfileView:(req,res) => {
        const u_username = req.params.username;
        InsertUniqueProfileVisitor(u_username,(err,results) => {
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
                    message: "Profile not found"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Visitor logged"
            });
        });
    },
    GetUniqueViewCount:(req,res) => {
        const u_username = req.params.username;
        GetUniqueViewCountdata(u_username,(err,results) => {
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
                    message: "No Profile Views"
                });
            }
            function numFormatter(num) {
                if(num > 999 && num < 1000000){
                    return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
                }else if(num > 1000000){
                    return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
                }else if(num < 900){
                    return num; // if value < 1000, nothing to do
                }
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Visitor logged",
                unique_view_count : numFormatter(results[0]['unique_counts'])
            });
        });
    },
    Getloginhistory:(req,res) => {
        const username = req.params.username;
        Getloginhistorydata(username,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Fetched session data",
                data : results
            });
        })
    },
    GetotalReviewCount:(req,res) => {
        const u_uid = req.params.id;
        Getreviewdata(u_uid,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            if(!results[0])
            {
                return res.status(200).json({
                    status  :   "success",
                    message :   "Count fetched",
                    data : 0
                });
            }
            else
            {
                return res.status(200).json({
                    status  :   "success",
                    message :   "Count fetched",
                    data : results[0]['count_review']
                });
            }
        });
    },
    GetreviewCountbyUsername:(req,res) => {
        const u_username = req.params.username;
        GetReviewCount(u_username,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            if(!results[0])
            {
                return res.status(200).json({
                    status  :   "success",
                    message :   "Count fetched",
                    data : 0
                });
            }
            else
            {
                return res.status(200).json({
                    status  :   "success",
                    message :   "Count fetched",
                    data : results[0]['count_review']
                });
            }
        });
    },
    SendMessageToUser:(req,res) => {
        const body = req.body;
        var u_uid = req.params.id;
        body.u_uid = u_uid;
        PostMessageToUser(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   results
            });
        });
    },
    UpdateTagline:(req,res) => {
        var username = req.params.username;
        var tagline = req.params.tagline;
        const body = req.body;
        body.username = username;
        body.tagline = tagline;
        UpdateTagLineDb(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            return res.status(200).json({
                status : "success",
                message : tagline
            });
        });
    },
    UpdatePerHourCost:(req,res) => {
        var username = req.params.username;
        var cost = req.params.cost;
        const body = req.body;
        body.username = username;
        body.cost = cost;
        UpdatePerHourCostDb(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            return res.status(200).json({
                status : "success",
                message : cost
            });
        });
    },
    CheckistrialDone:(req,res) => {
        var username = req.params.username;
        CheckIfUserTrialIsDone(username,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            if(results)
            {
                if(results.length === 0)
                {
                    return res.status(404).json({
                        status: "err",
                        message: "profile not found"
                    });
                }
                if(results[0]['is_pro'] == 1)
                {
                    return res.status(200).json({
                        status : "success",
                        message : "you can use subdomain"
                    });
                }
                else
                {
                    var now = new Date();
                    var then = new Date(results[0]['u_join']);
                    var diff = (now - then)/1000/60/60/24;
                    var round = Math.round(diff);
                    var int = parseInt(round);
                    console.log(int);
                    if(int > 15)
                    {
                        return res.status(200).json({
                            status : "err",
                            message : "Upgarde to pro"
                        });
                    }
                    else
                    {
                        return res.status(200).json({
                            status : "success",
                            message : "you can use subdomain"
                        });
                    }
                }
            }
        });
    },
    UpdateUserSocialProfile:(req,res) => {
        var body = req.body;
        body.facebook = req.query.fb;
        body.github = req.query.git;
        body.linkedin = req.query.lin;
        body.dribbble = req.query.dri;
        body.instagram = req.query.ins;
        body.username = req.params.username;
        UpdateUsersSocialProfilesdb(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            return res.status(200).json({
                status : "success",
                message : "Social profile updated"
            });
        });
    }
}