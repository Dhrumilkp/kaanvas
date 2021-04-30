const pool = require('../../config/database');

module.exports = { 
    GenerateUniqueUrl:(body,callback) => {
        
    },
    GetCollectData:(u_uid,callback) => {
        pool.query(
            `SELECT count(*) as countcollect FROM  ka_collect_url WHERE u_uid = ?`,
            [
                u_uid
            ],
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