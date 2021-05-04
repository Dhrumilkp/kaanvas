const {
    GetIndustrycat,
    GetSubcatData
} = require('./cat.service');

module.exports = {
    GetMainCat:(req,res) => {
        const body = req.body;
        GetIndustrycat(body,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                status  :   "success",
                message :   "Industry Category Fetched",
                data : results
            });
        });
    },
    GetSubcat:(req,res) => {
        const id = req.params.id;
        GetSubcatData(id,(err,fetch_results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
            return res.status(200).json({
                results : fetch_results
            });
        });
    }
}