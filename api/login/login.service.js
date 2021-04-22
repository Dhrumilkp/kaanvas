const pool = require("../../config/database");

module.exports = {
    checkuserExists:(email,callback) => {
        pool.query(
            `SELECT * FROM ka_user WHERE u_email=?`,
            [email],
            (error,results,field) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results);
            }
        );
    },
    loginauth:(data,callback) => {
        pool.query(

        );
    },
    gloginauth:(data,callback) => {

    },
    inloginauth:(data,callback) => {

    }
}