const pool = require('../../config/database');

module.exports = {
    GetReviewData:(review_id,callback) => {
        pool.query(
            `SELECT *,ka_industry_cat.name as industry_cat_name ,ka_sub_cat.name as industry_sub_cat_name FROM ka_collect_url LEFT JOIN ka_industry_cat ON ka_collect_url.industry_cat = ka_industry_cat.id LEFT JOIN ka_sub_cat ON ka_collect_url.industry_sub_cat = ka_sub_cat.id WHERE ka_collect_url.unique_uid = ? `,
            [
                review_id
            ],
            (error,reviewurlresult,fields) =>{
                console.log(reviewurlresult);
                if(error)
                {
                    callback(error);
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
    }
}