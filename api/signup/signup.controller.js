const { create, checkUser } = require("./signup.service");
const { genSaltSync,hashSync } = require("bcrypt");
const {OAuth2Client} = require('google-auth-library');
const { sign } = require("jsonwebtoken");
const { uniqueNamesGenerator, adjectives, colors, animals,countries } = require('unique-names-generator');
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals,countries] }); // big_red_donkey
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
        const body = req.body;
        const payload =  client.verifyIdToken({
            idToken: body.token,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        let user = {};
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: body.token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            user.u_email = payload.email;
            user.u_firstname = payload.given_name;
            user.u_lastname = payload.family_name;
        }
        verify().then(() => {
            user.headers = req.headers;
            user.current_ip = req.ip;
            user.u_username = uniqueNamesGenerator({
                dictionaries: [adjectives, animals, colors,countries], // colors can be omitted here as not used
                length: 3
            });
            user.login_type = "Google";
            checkUser(user,(err,results) => {
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
                create(user,(err,results) => {
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
            })
        });
    }
}

