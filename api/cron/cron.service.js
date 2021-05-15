const pool = require('../../config/database');

module.export = { 
    UpdateDbFlag: (data,callback) => {
        pool.query(
            'UPDATE ka_collect SET is_pushed_cloud = ? WHERE is_pushed_cloud = ?',
            [
                1,
                0
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return (null,results);
            }
        )
    }
};