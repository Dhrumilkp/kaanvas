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
    LoginUpdate:(data,callback) => {
        pool.query(
            `INSERT INTO ka_usersessioninfo (browser_name,operating_system)
            values (?,?)`,
            [
                data['browser-name'],
                data['operating-system']
            ],
            (error,results,field) => {
                if(error)
                {
                    callback(error);
                }
            }
        )
    },
    gloginauth:(email,callback) => {
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
    inloginauth:(data,callback) => {

    }
}