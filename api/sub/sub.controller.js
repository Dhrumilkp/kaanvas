const {
    createsubscription
} = require('./sub.service');
const stripe = require('stripe')(process.env.STRIP_SK);
module.exports = {
    CreateSub:(req,res) => {
        let body = req.body;
        const u_uid = req.params.id;
        stripe.paymentMethods.attach(
            body.paymentMethodId,
            {customer: body.customerId}
        )
        .then(
            payment_intent_object => {
                // Update customer payment as default
                stripe.customers.update(
                    body.customerId,
                    {invoice_settings: {default_payment_method: body.paymentMethodId}}
                )
                .then(
                    // Check if coupon is there or not 
                    response_data => {
                        if(body.coupon_code !== "0")
                        {
                            // With coupon
                            stripe.subscriptions.create({
                                customer: body.customerId,
                                items: [
                                    {price: body.priceId},
                                ],
                                expand : ['latest_invoice.payment_intent'],
                                coupon : body.coupon_code
                            })
                            .then(
                                subscription_object =>{
                                    subscription_object.u_uid = u_uid;
                                    subscription_object.price_id_pass = body.priceId;
                                    createsubscription(subscription_object,(err,results) => {
                                        if(err)
                                        {
                                            return res.status(500).json({
                                                status: "err",
                                                message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
                                            });
                                        }
                                        return res.status(200).json({
                                            status: "success",
                                            message: "Your subscription was created, please wait while we upgrade you.."
                                        });
                                    });
                                }
                            )
                            .catch(
                                error => {
                                    console.log(error);
                                }
                            )
                        }
                        else
                        {
                            // Without Coupon
                            stripe.subscriptions.create({
                                customer: body.customerId,
                                items: [
                                    {price: body.priceId},
                                ],
                                expand : ['latest_invoice.payment_intent']
                            })
                            .then(
                                subscription_object =>{
                                    subscription_object.u_uid = u_uid;
                                    subscription_object.price_id_pass = body.priceId;
                                    createsubscription(subscription_object,(err,results) => {
                                        if(err)
                                        {
                                            return res.status(500).json({
                                                status: "err",
                                                message: "Internal server err, please reach out to our support team on support@ratefreelancer.com"
                                            });
                                        }
                                        return res.status(200).json({
                                            status: "success",
                                            message: "Your subscription was created, please wait while we upgrade you.."
                                        });
                                    });
                                }
                            )
                            .catch(
                                error =>{
                                    console.log(error);
                                }
                            )
                        }
                    }
                )
                .catch(error => {
                    console.log(error);
                })
            }
            
        )
        .catch(error => {
            console.log(error); 
        })
    },
    GetInvoices:(req,res) => {
        const customer_id = req.params.customerid;
        stripe.invoices.list({
            customer    : customer_id,
            limit       : 10,
            status      : 'paid'
        })
        .then(
            invoice_data => {
                return res.status(200).json({
                    status: "success",
                    message: "Your invoice data is fetched",
                    data : invoice_data
                });
            }
        )
        .catch(
            error => {
                return res.status(500).json({
                    status: "err",
                    message: "There was some error fetching your invoices, please reach out to customer support on support@ratefreelancer.com"
                });
            }
        )
    }
}