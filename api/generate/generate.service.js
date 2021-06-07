const pool = require('../../config/database');
var uniqid = require('uniqid');
module.exports = { 
    GenerateUniqueUrl:(body,callback) => {
        var uniqueid = uniqid('review-');
        pool.query(
            `INSERT INTO ka_collect_url (unique_uid,u_uid,project_title,project_description,industry_cat,industry_sub_cat,project_tags,skills_tags,project_duration,project_amount)
            values (?,?,?,?,?,?,?,?,?,?)`,
            [
                uniqueid,
                body.u_uid,
                body.project_title,
                body.project_desc,
                body.industry_cat,
                body.industry_sub_cat,
                body.project_tags,
                body.skills_tags,
                body.project_duration,
                body.project_amount
            ],
            (error,results,fields) => {
                var folio_data = body.project_folio;
                return callback(null,folio_data);
                folio_data.forEach(element => {
                    pool.query(
                        `INSERT INTO ka_collect_folios (unique_id,folio_url,folio_type,created_on,u_uid)
                        values (?,?,?,?,?)`,
                        [
                            uniqueid,
                            element.file_name,
                            element.type,
                            Date.now(),
                            body.u_uid
                        ],
                        (error,results,fields) => {
                            if(error)
                            {
                                console.log(error);
                            }
                        }
                    )
                });
                if(error)
                {
                    console.log(error);
                }
                return callback(null,uniqueid);
            }
        )
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
    },
    GetCollectURLdata:(u_uid,callback) => {
        pool.query(
            `SELECT * FROM ka_collect_url WHERE u_uid = ? AND is_used = 0 LIMIT 10`,
            [
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
}