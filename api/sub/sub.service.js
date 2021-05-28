const pool = require('../../config/database');
const stripe = require('stripe')(process.env.STRIP_SK);

module.exports = {
    UpdateSubscriptionUser:(body,callback) => {
        // Update subscription if past was there
        pool.query(
            `SELECT * FROM ka_usersubscription_info WHERE u_uid = ?`,
            [
                data.u_uid
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                if(results[0]){
                    
                    // Update
                    pool.query(
                        `UPDATE ka_usersubscription_info SET subscription_id = ?,price_id = ?,created_on = ?,pay_id = ?,amount = ?,currency = ?, customer_id = ? WHERE u_uid = ?`,
                        [
                            data.subscription_id,
                            data.priceId,
                            data.created_on,
                            data.pay_id,
                            data.amount,
                            data.currency,
                            data.customerId,
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
                if(!results[0]){
                    // Insert
                    pool.query(
                        `INSERT INTO ka_usersubscription_info (customer_id,subscription_id,u_uid,price_id,created_on,pay_id,amount,currency)
                        VALUES (?,?,?,?,?,?,?,?)`,
                        [
                            data.customerId,
                            data.subscription_id,
                            data.u_uid,
                            data.priceId,
                            data.created_on,
                            data.pay_id,
                            data.amount,
                            data.currency
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
    },
    UpdateStripeCustomerInDatabase:(data,callback) => {
        pool.query(
            `UPDATE ka_user SET u_city = ?,u_country = ?, u_postal_code = ?, u_country_iso = ? WHERE customer_id = ?`,
            [
                data.city,
                data.country,
                data.zipcode,
                data.countryiso,
                data.customer_id
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
};