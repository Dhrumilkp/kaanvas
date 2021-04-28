const pool = require('../../config/database');
const stripe = require('stripe')(process.env.STRIP_SK);

module.exports = {
    createsubscription:(data,callback) => {
        pool.query(
            `INSERT INTO ka_usersubscription_info (u_uid,sub_id,price_id)
            VALUES (?,?,?)`,
            [
                data.u_uid,
                data.id,
                data.price_id_pass
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                pool.query(
                    `UPDATE ka_user SET is_pro = ? WHERE id =?`,
                    [
                        1,
                        data.u_uid
                    ],
                    (error,results,fields) => {
                        if(error)
                        {
                            console.log(error);
                        }
                        return callback(null,results);
                    }
                )
            }
        )
    }
};