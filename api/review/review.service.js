const rateLimit = require('express-rate-limit');
const pool = require('../../config/database');

module.exports = {
    GetportfoliosForReview:(review_id,callback) => {
        pool.query(
            `SELECT folio_url,folio_type,is_pushed_cloud FROM ka_collect_folios WHERE unique_id = ?`,
            [
                review_id
            ],
            (err,results,fields) => {
                if(err)
                {
                    callback(err);
                }
                return callback(null,results);
            }
        )
    },
    GetReviewData:(review_id,callback) => {
        pool.query(
            `SELECT *,ka_industry_cat.name as industry_cat_name ,ka_sub_cat.name as industry_sub_cat_name FROM ka_collect_url LEFT JOIN ka_industry_cat ON ka_collect_url.industry_cat = ka_industry_cat.id LEFT JOIN ka_sub_cat ON ka_collect_url.industry_sub_cat = ka_sub_cat.id WHERE ka_collect_url.unique_uid = ? AND ka_collect_url.is_used = 0`,
            [
                review_id
            ],
            (error,reviewurlresult,fields) =>{
                if(error)
                {
                    callback(error);
                }
                if(!reviewurlresult[0])
                {
                    return callback(null,reviewurlresult);
                }
                pool.query(
                    `SELECT is_pro FROM ka_user WHERE id = ?`,
                    [
                        reviewurlresult[0]['u_uid']
                    ],
                    (error,results,fields) => {
                        if(error)
                        {
                            console.log(error);
                        }
                        reviewurlresult.is_pro = results[0]['is_pro'];
                        return callback(null,reviewurlresult);
                    }
                )
            }
        )
    },
    UpdateReviewWithResponse:(data,callback) => {
        pool.query(
            `UPDATE ka_collect_url SET is_used = ?, testimonial_type = ?, testimonial_path = ?, rating_score = ?, rating_summary = ?, client_profilepic = ?, client_name = ?, reviewed_on = ?, referr_header = ? WHERE unique_uid = ?`,
            [
                1,
                data.testimonial_type,
                data.testimonial_path,
                data.rating_score,
                data.rating_summary,
                data.client_profilepic,
                data.client_name,
                data.reviewed_on,
                data.referr_header,
                data.review_id
                
            ],
            (error,results,fields) =>
            {
                if(error)
                {
                    callback(error);
                }
                pool.query(
                    `SELECT u_uid FROM ka_collect_url WHERE unique_uid = ?`,
                    [
                        data.review_id
                    ],
                    (err,results,fields) => {
                        if(err)
                        {
                            callback(err);
                        }
                        var u_uid = results[0]['u_uid'];
                        pool.query(
                            `INSERT INTO ka_collect_testi (unique_id,u_uid,testimonial_path,testimonial_type,created_on)
                            VALUES (?,?,?,?,?)`,
                            [
                                data.review_id,
                                u_uid,
                                data.testimonial_path,
                                data.testimonial_type,
                                Date.now()
                            ],
                            (err,results,fields) => {
                                if(err)
                                {
                                    callback(err);
                                }
                                pool.query(
                                    `UPDATE ka_collect_folios SET is_verified = ? WHERE unique_id = ?`,
                                    [
                                        1,
                                        data.review_id
                                    ],
                                    (error,results,fields) => {
                                        if(error)
                                        {
                                            callback(error);
                                        }
                                        return callback(null,results);
                                    }
                                );
                            }
                        )
                    }
                );
            }
        )
    },
    GetallreviewUserData:(body,callback) => {
        const startIndex = (body.page - 1) * body.limit;
        const endIndex = body.page * body.limit;
        const returnresults = {};
        pool.query(
            `SELECT id FROM ka_user WHERE u_username = ?`,
            [
                body.u_username
            ],
            (error,results,fields) =>{
                if(error)
                {
                    callback(error)
                }
                const u_uid = results[0]['id'];
                pool.query(
                    `SELECT *,ka_industry_cat.name as industry_cat_name ,ka_sub_cat.name as industry_sub_cat_name FROM ka_collect_url LEFT JOIN ka_industry_cat ON ka_collect_url.industry_cat = ka_industry_cat.id LEFT JOIN ka_sub_cat ON ka_collect_url.industry_sub_cat = ka_sub_cat.id WHERE ka_collect_url.u_uid = ? AND ka_collect_url.is_used = ? ORDER BY ka_collect_url.id`,
                    [
                        u_uid,
                        1,
                        startIndex,
                        endIndex
                    ],
                    (error,results,fields) =>{
                        if(error)
                        {
                           callback(error);
                        }
                        const resultUsers = results.slice(startIndex,endIndex);
                        if(!resultUsers[0])
                        {
                            return callback(null,"false"); 
                        }
                        returnresults.data = resultUsers;
                        if(endIndex < results.length)
                        {
                            console.log("Page is present");
                            returnresults.next = {
                                page : body.page + 1,
                                limit : body.limit
                            }
                        }
                        if(startIndex > 0)
                        {
                            returnresults.previous = {
                                page : body.page - 1,
                                limit : body.limit
                            }
                        }
                        return callback(null,returnresults);
                    }
                )
            }
        )  
    },
    GetAllUsersFolio:(body,callback) => {
       const startIndex = (body.page - 1) * body.limit;
        const endIndex = body.page * body.limit;
        const returnresults = {};
        pool.query(
            `SELECT id FROM ka_user WHERE u_username = ?`,
            [
                body.u_username
            ],
            (error,results,fields) =>{
                if(error)
                {
                    callback(error)
                }
                const u_uid = results[0]['id'];
                pool.query(
                    `select * from ka_collect_folios where u_uid = ? and is_verified = ?`,
                    [
                        u_uid,
                        1,
                        startIndex,
                        endIndex
                    ],
                    (error,results,fields) =>{
                        if(error)
                        {
                           callback(error);
                        }
                        const resultUsers = results.slice(startIndex,endIndex);
                        if(!resultUsers[0])
                        {
                            return callback(null,"false"); 
                        }
                        returnresults.data = resultUsers;
                        if(endIndex < results.length)
                        {
                            returnresults.next = {
                                page : body.page + 1,
                                limit : body.limit
                            }
                        }
                        if(startIndex > 0)
                        {
                            returnresults.previous = {
                                page : body.page - 1,
                                limit : body.limit
                            }
                        }
                        return callback(null,returnresults);
                    }
                )
            }
        )   
    },
    GetallTestimonialdatafromdb:(body,callback) => {
        const startIndex = (body.page - 1) * body.limit;
        const endIndex = body.page * body.limit;
        const returnresults = {};
        pool.query(
            `SELECT id FROM ka_user WHERE u_username = ?`,
            [
                body.u_username
            ],
            (error,results,fields) =>{
                if(error)
                {
                    callback(error)
                }
                const u_uid = results[0]['id'];
                pool.query(
                    `SELECT *,ka_industry_cat.name as industry_cat_name ,ka_sub_cat.name as industry_sub_cat_name FROM ka_collect_url LEFT JOIN ka_industry_cat ON ka_collect_url.industry_cat = ka_industry_cat.id LEFT JOIN ka_sub_cat ON ka_collect_url.industry_sub_cat = ka_sub_cat.id WHERE ka_collect_url.u_uid = ? AND ka_collect_url.is_used = ? ORDER BY ka_collect_url.id`,
                    [
                        u_uid,
                        1,
                        startIndex,
                        endIndex
                    ],
                    (error,results,fields) =>{
                        if(error)
                        {
                           callback(error);
                        }
                        const resultUsers = results.slice(startIndex,endIndex);
                        returnresults.data = resultUsers;
                        if(endIndex < resultUsers.length)
                        {
                            returnresults.next = {
                                page : page + 1,
                                limit : body.limit
                            }
                        }
                        if(startIndex > 0)
                        {
                            returnresults.previous = {
                                page : page - 1,
                                limit : body.limit
                            }
                        }
                        return callback(null,returnresults);
                    }
                )
            }
        )  
    },
    GetReviewsAvgRating:(u_uid,callback) => {
        pool.query(
            `SELECT avg(rating_score) as rating_score FROM ka_collect_url WHERE is_used = ? AND u_uid = ?`,
            [
                1,
                u_uid
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    Getratingforuserbyusername:(u_username,callback) => {
        pool.query(
            `SELECT id FROM ka_user WHERE u_username = ?`,
            [
                u_username
            ],
            (err,results,fields) => {
                if(err)
                {
                    callback(err)
                }
                var u_uid = results[0]['id'];
                pool.query(
                    `SELECT avg(rating_score) as rating_score FROM ka_collect_url WHERE is_used = ? AND u_uid = ?`,
                    [
                        1,
                        u_uid
                    ],
                    (error,results,fields) => {
                        if(error)
                        {
                            callback(error);
                        }
                        return callback(null,results);
                    }
                )
            }
        )
    },
    GetReviewDataInDetail:(unique_id,callback) =>{
        pool.query(
            `SELECT *,ka_industry_cat.name as industry_cat_name ,ka_sub_cat.name as industry_sub_cat_name FROM ka_collect_url LEFT JOIN ka_industry_cat ON ka_collect_url.industry_cat = ka_industry_cat.id LEFT JOIN ka_sub_cat ON ka_collect_url.industry_sub_cat = ka_sub_cat.id WHERE ka_collect_url.unique_uid = ?`,
            [
                unique_id
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    GetallCountsDataUser:(u_username,callback) => {
        const returnresults = {};
        pool.query(
            `SELECT id FROM ka_user WHERE u_username = ?`,
            [
                u_username
            ],
            (err,results,fields) => {
                if(err)
                {
                    callback(err)
                }
                var u_uid = results[0]['id'];
                pool.query(
                    `SELECT count(*) as review_count from ka_collect_url where u_uid = ? and is_used = ?`,
                    [
                        u_uid,
                        1
                    ],
                    (error,results,fields) => {
                        if(error)
                        {
                            callback(error);
                        }
                        returnresults.review_counts = results[0]['review_count'];
                        pool.query(
                            `SELECT count(*) as folio_count from ka_collect_folios where u_uid = ? AND is_verified = ?`,
                            [
                                u_uid,
                                1
                            ],
                            (error,results,fields) => {
                                if(error)
                                {
                                    callback(error);
                                }
                                returnresults.folio_count = results[0]['folio_count'];
                                pool.query(
                                    `SELECT count(*) as testimonial_count from ka_collect_testi where u_uid = ?`,
                                    [
                                        u_uid
                                    ],
                                    (error,results,fields) => {
                                        if(error)
                                        {
                                            callback(error);
                                        }
                                        returnresults.testi_count = results[0]['testimonial_count'];
                                        return callback(null,returnresults);
                                    }
                                )
                            }
                        );
                    }
                )
            }
        );
    }
}