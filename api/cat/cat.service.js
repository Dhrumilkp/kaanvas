const pool  = require('../../config/database');

module.exports = {
    GetIndustrycat:(data,callback) => {
        pool.query(
            `SELECT * FROM ka_industry_cat`,
            (error,results,fields) => {
                if(error)
                {
                    callback(error)
                }
                return callback(null,results);
            }
        )
    },
    GetSubcatData:(id,callback) => {
        pool.query(
            `SELECT id,name as text FROM  ka_sub_cat WHERE cat_id = ?`,
            [
                id
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
}