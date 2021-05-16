const {
    UpdateDbFlag
} = require('./cron.service');

module.exports = {
    UpdateCloudSyncFlag:(req,res) =>{
        const body = req.body;
        UpdateDbFlag(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: err
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Cloud Flag Updated"
            });
        });
    }
}