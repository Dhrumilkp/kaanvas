const {
    GetReviewData,
    UpdateReviewWithResponse,
    GetallreviewUserData,
    GetReviewsAvgRating,
    Getratingforuserbyusername,
    GetallTestimonialdatafromdb,
    GetReviewDataInDetail,
    GetallCountsDataUser,
    GetportfoliosForReview,
    GetAllUsersFolio,
    FetchAllTestiUser,
    GetportfoliosForReviewDATA
} = require('./review.service');
const { sign } = require("jsonwebtoken");

module.exports = {
    GetallcountsUser:(req,res) => {
        const u_username = req.params.username;
        GetallCountsDataUser(u_username,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                }); 
            }
            return res.status(200).json({
                status: "success",
                message: "Fetched all counts",
                data:results
            });
        });
    },
    ReviewData:(req,res) => {
        const review_id = req.params.id;
        GetReviewData(review_id,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            if(!results[0])
            {
                return res.status(404).json({
                    status: "err",
                    message: "We cannot find such review url"
                });
            }
            GetportfoliosForReview(review_id,(err,foli_data) => {
                if(err)
                {
                    return res.status(500).json({
                        status: "err",
                        message: "Internal server err, please reach out to our support team on support@onelink.cards"
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
                    folio_data:foli_data,
                    is_pro : results.is_pro
                });
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
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
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
            if(results == "false")
            {
                return res.status(200).json({
                    status: "reachedmax-results",
                    message: "No more results to show!"
                });  
            }
            return res.status(200).json({
                status: "success",
                message: "Fetch success",
                results : results
            });
        });
    },
    GetusersFolioData:(req,res) => {
        const u_username = req.params.username;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const body = req.body;
        body.u_username = u_username;
        body.page = page;
        body.limit = limit;
        GetAllUsersFolio(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            if(results == "false")
            {
                return res.status(200).json({
                    status: "reachedmax-results",
                    message: "No more results to show!"
                });  
            }
            return res.status(200).json({
                status: "success",
                message: "Fetch success",
                results : results
            });
        });
    },
    GetallTestimonialUser:(req,res) => {
        const u_username = req.params.username;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const body = req.body;
        body.u_username = u_username;
        body.page = page;
        body.limit = limit;
        FetchAllTestiUser(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            if(results == "false")
            {
                return res.status(200).json({
                    status: "reachedmax-results",
                    message: "No more results to show!"
                });  
            }
            return res.status(200).json({
                status: "success",
                message: "Fetch success",
                results : results
            });
        });
    },  
    GetratingAvg:(req,res) => {
        const u_uid  = req.params.id;
        GetReviewsAvgRating(u_uid,(err,results) =>{ 
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            var rounded = Math.round(results[0].rating_score * 10) / 10
            return res.status(200).json({
                status: "success",
                message: "Fetch success",
                rating : rounded
            });
        });
    },
    GetratingAvgbyusername:(req,res) => {
        const u_username = req.params.username;
        Getratingforuserbyusername(u_username,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            var rounded = Math.round(results[0].rating_score * 10) / 10
            return res.status(200).json({
                status: "success",
                message: "Fetch success",
                rating : rounded
            });
        });
    },
    GetallTestimonial:(req,res) => {
        const u_username = req.params.username;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const body = req.body;
        body.u_username = u_username;
        body.page = page;
        body.limit = limit;
        GetallTestimonialdatafromdb(body,(err,results) =>{
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Fetch success",
                results : results
            });
        });
    },
    GetReviewReaddata:(req,res) => {
        const unique_id = req.params.id;
        GetReviewDataInDetail(unique_id,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            // Get portfolio data
            GetportfoliosForReviewDATA(unique_id,(err,results_folio) => {
                if(err)
                {
                    return res.status(200).json({
                        status: "success",
                        message: "Fetch success",
                        results : results,
                        portfolio_data : ""
                    });
                }
                else
                {
                    return res.status(200).json({
                        status: "success",
                        message: "Fetch success",
                        results : results,
                        portfolio_data : results_folio
                    });
                }
            });
           
        });
    },
    GetFolioForUnique:(req,res) => {
        const unique_id = req.params.id;
        GetportfoliosForReviewDATA(unique_id,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Fetch success",
                portfolio_data : results
            });
        });
    }
}

