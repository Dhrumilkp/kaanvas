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
    }
}