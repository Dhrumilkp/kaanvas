const pool = require('../../config/database');
module.exports = {
    GetallMessagesUser:(body,callback) => {
        const startIndex = (body.page - 1) * body.limit;
        const endIndex = body.page * body.limit;
        const returnresults = {};
        pool.query(
            `select * from ka_user_message where u_uid = ?`,
            [
                body.u_uid,
                1,
                startIndex,
                endIndex
            ],
            (error,results,fields) =>{
                if(error)
                {
                   callback(error);
                }
                const resultUsers = results.slice(startIndex,endIndex);
                if(!resultUsers[0])
                {
                    return callback(null,"false"); 
                }
                returnresults.data = resultUsers;
                if(endIndex < results.length)
                {
                    returnresults.next = {
                        page : body.page + 1,
                        limit : body.limit
                    }
                }
                if(startIndex > 0)
                {
                    returnresults.previous = {
                        page : body.page - 1,
                        limit : body.limit
                    }
                }
                return callback(null,returnresults);
            }
        )
    }
}