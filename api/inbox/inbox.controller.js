const {
    GetallMessagesUser
} = require('./inbox.service');

module.exports = {
    GetallinboxMessage:(req,res) => {
        const u_uid = req.params.id;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const body = req.body;
        body.u_uid = u_uid;
        body.page = page;
        body.limit = limit;
        GetallMessagesUser(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                status: "success",
                data : results
            });
        });
    }
}