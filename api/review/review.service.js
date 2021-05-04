const pool = require('../../config/database');

module.exports = {
    GetReviewData:(review_id,callback) => {
        pool.query(
            `SELECT * FROM ka_collect_url WHERE unique_uid = ?`,
            [
                review_id
            ],
            (error,reviewurlresult,fields) =>{
                console.log(error);
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