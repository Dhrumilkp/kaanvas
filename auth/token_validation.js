const { verify } = require ("jsonwebtoken");

module.exports = {
    checkToken:(req,res,next) => {
        const token = req.get("authorization");
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
    }
}