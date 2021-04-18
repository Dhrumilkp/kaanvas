const {checkuserExists} = require('./login.service');

module.exports = {
    login:(req,res) => {
        const body = req.body;
        const u_email = body.u_email;
        checkuserExists(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@kaanvas.art"
                });
            }
            if(results == false)
            {   
                return res.status(404).json({
                    status: "err",
                    message: "Cannot find a user with that email address"
                });
            }
            else
            {
                return res.status(200).json({
                    status: "success",
                    message: "user do exists"
                });
            }
        });
    }
}