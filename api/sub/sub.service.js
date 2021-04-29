const pool = require('../../config/database');
const stripe = require('stripe')(process.env.STRIP_SK);

module.exports = {
    createsubscription:(data,callback) => {
        pool.query(
            `INSERT INTO ka_usersubscription_info (u_uid,sub_id,customer_id,price_id)
            VALUES (?,?,?,?)`,
            [
                data.u_uid,
                data.id,
                data.customer,
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
    },
    GetSubscriptionId:(customer_id,callback) => {
        pool.query (
            `SELECT * FROM ka_usersubscription_info WHERE customer_id = ?`,
            [
                customer_id
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    },
    DemoteUserToFree:(data,callback) => {
        pool.query(
            `INSERT INTO ka_user_pro_cancel (u_uid,u_username,message)
            VALUES (?,?,?)`,
            [
                data.u_uid,
                data.u_username,
                data.message
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                pool.query(
                    `UPDATE ka_user SET is_pro = ? WHERE id = ?`,
                    [
                        1,
                        data.u_uid
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
        )
    }
};