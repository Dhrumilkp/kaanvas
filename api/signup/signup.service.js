const pool = require("../../config/database");
module.exports = {
    create: (data,callback) => {
        pool.query(
            // Your query
            `insert into ka_user(login_type,u_firstname,u_lastname,u_email,u_username,u_password,current_ip,current_useragent)
            values(?,?,?,?,?,?,?,?)
            `,
            [
              data.login_type,
              data.u_firstname,
              data.u_lastname,
              data.u_email,
              data.u_username,
              data.u_password,
              data.current_ip,
              data.current_useragent
            ],
            (error,results,fields) => {
                if(error)
                {
                    callback(error);
                }
                return callback(null,results)
            }
        );
    }
};