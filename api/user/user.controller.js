const { getUserByid } = require("./user.service");

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
    }
}