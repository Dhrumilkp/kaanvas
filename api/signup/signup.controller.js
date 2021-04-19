const { create, checkUser } = require("./signup.service");
const { genSaltSync,hashSync } = require("bcrypt");
const {OAuth2Client} = require('google-auth-library');

module.exports = {
    createUser: (req,res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.u_password = hashSync(body.u_password, salt);
        body.current_ip = req.ip;
        checkUser(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@kaanvas.art"
                });
            }
            if(results)
            {
                return res.status(500).json({
                    status: "err",
                    message: "User already registered!"
                });
            }
            create(body,(err,results) => {
                if(err)
                {
                    return res.status(500).json({
                        status: "err",
                        message: "Database connection error"
                    });
                }
                return res.status(200).json({
                    status: "success",
                    data:results
                });
            });
        });
    },
    gcreateUser:(req,res) => {
        
    },
    increateUser:(req,res) => {

    }
}