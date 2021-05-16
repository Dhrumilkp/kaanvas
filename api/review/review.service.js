const pool = require('../../config/database');

module.exports = {
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
            `UPDATE ka_collect_url SET is_used = ?, project_folio_status = ?, testimonial_type = ?, testimonial_path = ?, rating_score = ?, rating_summary = ?, client_profilepic = ?, client_name = ?, reviewed_on = ? WHERE unique_uid = ?`,
            [
                1,
                data.project_folio_status,
                data.testimonial_type,
                data.testimonial_path,
                data.rating_score,
                data.rating_summary,
                data.client_profilepic,
                data.client_name,
                data.reviewed_on,
                data.review_id
            ],
            (error,results,fields) =>
            {
                if(error)
                {
                    console.log(error);
                }
                return callback(null,results);
            }
        )
    }
}