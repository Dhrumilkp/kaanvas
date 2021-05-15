const {
    UpdateDbFlag
} = require('./cron.service');

module.export = {
    UpdateCloudSyncFlag:(req,res) =>{
        const body = req.body;
        UpdateDbFlag(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@kaanvas.art"
                });
            }
            return res.status(200).json({
                status: "err",
                message: "Cloud Flag Updated"
            });
        });
    }
}