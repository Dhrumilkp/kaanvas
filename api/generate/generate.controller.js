const {
    GenerateUniqueUrl,
    GetCollectData,
    GetCollectURLdata
} = require ('./generate.service');

module.exports = {
    GenerateUrl:(req,res) => {
        var body = req.body;
        const u_uid = req.params.id;
        body.u_uid = u_uid;
        GenerateUniqueUrl(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                status: "success",
                unique_id : results
            });
        });
    },
    ReturnNature:(req,res) => {
        return res.status(200).json({
            status: "success",
            message : "Yes you can generate urls!"
        });
    },
    GetCollectCount:(req,res) => {
        const u_uid = req.params.id;
        GetCollectData(u_uid,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            if(!results[0])
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                status: "success",
                count : results[0]['countcollect']
            });
        })
    },
    GetCollectUrl:(req,res) => {
        const u_uid = req.params.id;
        GetCollectURLdata(u_uid,(err,results) => {
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