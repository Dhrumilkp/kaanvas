const pool = require("../../config/database");

module.exports = {
    getUserByid : (id,callback) => {
        pool.query(
            `SELECT u_firstname,u_lastname,u_email,u_username,onboarding_status,mailverify_status,u_join,u_profilepic_webp,u_profilepic_jpeg,u_coverpic_webp,u_coverpic_jpeg,u_verified,u_country,u_city,is_profile_complete,u_level,is_pro,customer_id,u_website_url,u_dribbble_url,u_github_url,u_default_profile_pic FROM ka_user WHERE id = ?`,
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
    },
    Updateuserprofile:(data,callback) => {
        pool.query (
            `SELECT * FROM ka_user WHERE u_username = ? AND id != ?`,
            [
                data.u_username,
                data.u_uid
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                if(results[0])
                {
                    return callback(null,false);
                }
                if(!results[0])
                {
                    pool.query (
                        `UPDATE ka_user SET u_firstname = ?, u_lastname = ?, u_username = ?, u_city = ?, u_country = ? WHERE id = ?`,
                        [
                            data.u_firstname,
                            data.u_lastname,
                            data.u_username,
                            data.u_city,
                            data.u_country,
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
            }
        ) 
    },
    UpdateProfilePic:(data,callback) => {
        pool.query(
            `UPDATE ka_user SET u_profilepic_webp = ?, u_profilepic_jpeg = ? WHERE id = ?`,
            [
                data.u_profilepic_webp,
                data.u_profilepic_jpeg,
                data.u_uid
            ],
            (error,results,fields) =>{
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        )
    }
}