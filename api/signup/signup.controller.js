const { create } = require("./signup.service");
const { genSaltSync,hashSync } = require("bcrypt");

module.exports = {
    createUser: (req,res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.u_password = hashSync(body.u_password, salt);
        body.current_ip = req.ip;
        create(body,(err,results) => {
            if(err)
            {
                console.log(err);
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
    }
}