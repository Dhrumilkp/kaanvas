const { verify } = require ("jsonwebtoken");
const pool = require('../config/database');
module.exports = {
    checkToken:(req,res,next) => {
        let token = req.get("authorization");
        if(token)
        {
            token = token.slice(7);
            verify(token,process.env.JWT_KEY,(err,decoded) => {
                if(err)
                {
                    res.status(403).json({
                        status  : "err",
                        message : "Access denied, Unauthorized user"
                    });
                }else
                {
                    next();
                }
            });
        }else
        {
            res.status(403).json({
                status  : "err",
                message : "Access denied, Unauthorized user"
            });
        }
    },
    checkapi:(req,res,next) => {
       const api_key = req.params.apikey;
       if(api_key == process.env.api_key)
        {
            next();
        }
        else
        {
            res.status(500).json({
                status  : "err",
                message : "Wrong api key"
            }); 
        }
    },
    checkPro:(req,res,next) => {
        const u_uid = req.params.id;
        pool.query(
            `SELECT * FROM ka_user WHERE id = ? AND is_pro = ?`,
            [
                u_uid,
                1
            ],
            (error,results,fields) => {
                if(error)
                {
                    res.status(500).json({
                        status  : "err",
                        message : "Something went wrong, reach out to our support executive on support@Onelink.cards.com"
                    });
                }
                if(!results[0])
                {
                    // Check if the user has pass thresold 
                    pool.query(
                        `SELECT count(*) as counturl WHERE u_uid = ? AND is_used = ?`,
                        [
                           u_uid,
                           0 
                        ],
                        (error,results,fields) => {
                            if(error)
                            {
                                res.status(500).json({
                                    status  : "err",
                                    message : "Something went wrong, reach out to our support executive on support@Onelink.cards.com"
                                });
                            }
                            if(results[0])
                            {
                                if(results[0]['counturl'] < 10)
                                {
                                    next();
                                }
                                else
                                {
                                    res.status(500).json({
                                        status  : "err",
                                        message : "You have used your free thresold, upgrade to pro!"
                                    });
                                }
                            }
                        }
                    )
                }
                if(results[0])
                {
                    next();
                }
            }
        )
    }
}