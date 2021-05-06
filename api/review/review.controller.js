const {
    GetReviewData
} = require('./review.service');
const { sign } = require("jsonwebtoken");

module.exports = {
    ReviewData:(req,res) => {
        const review_id = req.params.id;
        GetReviewData(review_id,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@kaanvas.art"
                });
            }
            if(!results[0])
            {
                return res.status(404).json({
                    status: "err",
                    message: "We cannot find such review url"
                });
            }
            const jsontoken = sign({result:results},process.env.JWT_KEY,{
                expiresIn: "1h"
            });
            return res.status(200).json({
                status: "success",
                message: "Fetched review data",
                temp_token : jsontoken,
                data : results,
                is_pro : results.is_pro
            });
        })
    }
}

