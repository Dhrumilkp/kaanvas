const { 
    getUserByid,
    Updateuserprofile,
    UpdateProfilePic,
    CheckForProfile,
    UpdateNewProfileBg,
    UpdateThemeForUser,
    GetReferalData,
    GetPromoCouponCode,
    InsertUniqueProfileVisitor 
} = require("./user.service");
module.exports = {
    GetUser:(req,res) => {
        const body = req.body;
        const id = req.params.id;
        getUserByid(id,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
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
                    message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
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
                    message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
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
                    message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
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
                    message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
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
                    message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
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
                    message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
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
                            message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
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
                    message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
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
    }
}