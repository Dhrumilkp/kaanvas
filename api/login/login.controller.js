const { checkuserExists } = require('./login.service');
const { compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    login:(req,res) => {
        const body = req.body;
        const u_email = body.u_email;
        checkuserExists(u_email,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@kaanvas.art"
                });
            }
            if(!results)
            {
                return res.status(404).json({
                    status : "err",
                    message : "Invalid email or password"
                });
            }
            const result = compareSync(body.u_password,results.u_password);
            if(result)
            {
                result.u_password = undefined;
                const jsontoken = sign({result:results},process.env.JWT_KEY,{
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    status  :   "success",
                    message :   "Login successful",
                    token   :   jsontoken,
                    email_verify : results.email_verify_status
                });
            }
            else
            {
                return res.status(500).json({
                    status  :   "err",
                    message :   "Invalid email or password"
                });
            }
        });
    }
}