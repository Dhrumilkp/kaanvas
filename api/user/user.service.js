const pool = require("../../config/database");

module.exports = {
    getUserByid : (id,callback) => {
        pool.query(
            `SELECT u_firstname,u_lastname,u_email,u_username,onboarding_status,mailverify_status,u_join,u_profilepic_webp,u_profilepic_jpeg,u_coverpic_webp,u_coverpic_jpeg,u_verified,u_country,u_city,is_profile_complete,u_level,is_pro,customer_id,u_website_url FROM ka_user WHERE id = ?`,
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