const pool = require('../../config/database');

module.exports = {
    GetReviewData:(review_id,callback) => {
        pool.query(
            `SELECT * FROM ka_collect_url WHERE unique_uid = ?`,
            [
                review_id
            ],
            (error,results,fields) =>{
                console.log(error);
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    }
}