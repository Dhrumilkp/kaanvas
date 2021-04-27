const { create, checkUser } = require("./signup.service");
const { genSaltSync,hashSync } = require("bcrypt");
const {OAuth2Client} = require('google-auth-library');
const { sign } = require("jsonwebtoken");
const { uniqueNamesGenerator, adjectives, colors, animals,countries } = require('unique-names-generator');
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals,countries] }); // big_red_donkey

module.exports = {
    createUser: (req,res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.u_password = hashSync(body.u_password, salt);
        body.current_ip = req.ip;
        body.u_username = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors,countries], // colors can be omitted here as not used
            length: 3
        });
        body.headers = req.headers;
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
                // create web token for the user 
                const jsontoken = sign({result:results},process.env.JWT_KEY,{
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    status: "success",
                    token   :   jsontoken,
                    u_uid : results.insertId 
                });
            });
        });
    },
    gcreateUser:(req,res) => {
        
    },
    increateUser:(req,res) => {

    }
}

