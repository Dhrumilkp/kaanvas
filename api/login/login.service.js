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
                if(results[0].mailverify_status == "0")
                {
                    results[0].email_verify_status = "false";
                }
                else
                {
                    results[0].email_verify_status = "true";
                }
                return callback(null,results[0]);
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