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
    PostMessageToUser
} = require("./user.service");
const stripe = require('stripe')(process.env.STRIP_SK);
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
        Updateuserprofile(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
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
    UpdateProfileTheme:(req,res) => {
        const body = req.body;
        const id = req.params.id;
        body.u_uid = id;
        UpdateThemeForUser(body,(err,results) => {
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
    SendMessageToUser:(req,res) => {
        const body = req.body;
        var u_uid = req.param.id;
        body.u_uid = u_uid;
        PostMessageToUser(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            if(!results[0])
            {
                return res.status(404).json({
                    status  :   "err",
                    message :   "No Such User"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   results
            });
        });
    }
}