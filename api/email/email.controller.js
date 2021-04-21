const { reSendVerifyEmail } = require('./email.service');

module.exports = {
    resendemail : (req,res) =>{
        const body = req.body;
        const u_email = body.u_email;
        reSendVerifyEmail(u_email,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@kaanvas.art"
                });
            }
            if(!results)
            {
                return res.status(404).json({
                    status: "err",
                    message: "Cannot find the email for which you are sending the request, reach out to support team on support@kaanvas.art"
                });
            }
            return res.status(200).json({
                status: "success",
                data:results
            });
        });
    }
};