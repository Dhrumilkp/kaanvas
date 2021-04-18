const pool = require("../../config/database");

module.exports = {
    checkuserExists:(data,callback) => {
        pool.query(
            `SELECT * FROM ka_user WHERE u_email=?`,
            [data.u_email],
            (error,result,field) => {
                if(error)
                {
                    callback(error);
                }
                if(result.length > 0)
                {
                    return callback(null, true);
                }
                else
                {
                    return callback(null,false);
                }
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