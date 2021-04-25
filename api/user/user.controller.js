const { getUserByid,Updateuserprofile,UpdateProfilePic } = require("./user.service");

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
        console.log(body);
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
    }
}