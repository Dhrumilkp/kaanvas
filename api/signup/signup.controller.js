const { create, checkUser,checkUsername } = require("./signup.service");
const { genSaltSync,hashSync } = require("bcrypt");
const {OAuth2Client} = require('google-auth-library');
const { sign } = require("jsonwebtoken");
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey

module.exports = {
    createUser: (req,res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.u_password = hashSync(body.u_password, salt);
        body.current_ip = req.ip;
        body.u_username = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
            length: 2
        });
        checkUsername(body.u_username,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@kaanvas.art"
                });
            }
            if(!results)
            {
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
                            data:results,
                            token   :   jsontoken 
                        });
                    });
                });
            }
            if(results)
            {
                body.u_username = makeid(4);
                function makeid(length) {
                    var result           = [];
                    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for ( var i = 0; i < length; i++ ) {
                      result.push(characters.charAt(Math.floor(Math.random() * 
                        charactersLength)));
                    }
                   return result.join('');
                }
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
                            data:results,
                            token   :   jsontoken 
                        });
                    });
                });
            }
        });
    },
    gcreateUser:(req,res) => {
        
    },
    increateUser:(req,res) => {

    }
}

