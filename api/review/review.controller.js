const {
    GetReviewData,
    UpdateReviewWithResponse,
    GetallreviewUserData
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
    },
    UpdateReviewData:(req,res) => {
        const review_id = req.params.id;
        const body = req.body;
        body.review_id = review_id;
        UpdateReviewWithResponse(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@kaanvas.art"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "review updated !"
            });
        });
    },
    GetallreviewUser:(req,res) => {
        const u_username = req.params.username;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const body = req.body;
        body.u_username = u_username;
        body.page = page;
        body.limit = limit;
        GetallreviewUserData(body,(err,results) =>{
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            if(!results[0]['data'])
            {
                return res.status(404).json({
                    status: "err",
                    message: "Cannot find any review associated with this account"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Fetch success",
                results : results
            });
        });
    }
}

