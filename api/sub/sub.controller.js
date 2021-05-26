const {
    createsubscription,
    GetSubscriptionId,
    DemoteUserToFree
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
                                                message: "Internal server err, please reach out to our support team on support@onelink.cards"
                                            });
                                        }
                                        return res.status(200).json({
                                            status: "success",
                                            message: subscription_object
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
                                                message: "Internal server err, please reach out to our support team on support@onelink.cards"
                                            });
                                        }
                                        return res.status(200).json({
                                            status: "success",
                                            message: subscription_object
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
    GetSubdetails:(req,res) => {
        const customer_id = req.params.customerid;
        GetSubscriptionId(customer_id,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server error, please reach out to customer support on support@onelink.cards"
                });
            }
            if(!results[0])
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server error, please reach out to customer support on support@onelink.cards"
                });
            }
            const subscription_id = results[0]['sub_id'];
            stripe.subscriptions.retrieve(
                subscription_id
            )
            .then(
                subscription_object => {
                    stripe.invoices.retrieveUpcoming({
                        customer: customer_id,
                    })
                    .then(nextinvoice_data =>{
                        stripe.invoices.list({
                            customer    : customer_id,
                            limit       : 10,
                            status      : 'paid'
                        })
                        .then(
                            invoice_data => {
                                return res.status(200).json({
                                    status: "success",
                                    message: "Subscription object",
                                    data : subscription_object,
                                    data_invoice : nextinvoice_data,
                                    invoice_list : invoice_data
                                });
                            }
                        )
                        .catch(
                            error => {
                                return res.status(500).json({
                                    status: "err",
                                    message: "There was some error fetching your invoices, please reach out to customer support on support@onelink.cards"
                                });
                            }
                        )
                    })
                    .catch(error => {
                        return res.status(500).json({
                            status: "err",
                            message: "Internal server error, please reach out to customer support on support@onelink.cards"
                        });
                    })
                    
                }
            )
            .catch(
                error => {
                    return res.status(500).json({
                        status: "err",
                        message: "Internal server error, please reach out to customer support on support@onelink.cards"
                    });
                }
            )
        });
    },
    CancelPro:(req,res) => {
        const u_username = req.params.username;
        const body = req.body;
        body.u_username = u_username;
        const customerId = body.customer_id;
        GetSubscriptionId(customerId,(err,results) => {
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server error, please reach out to customer support on support@onelink.cards"
                });
            }
            if(!results[0])
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server error, please reach out to customer support on support@onelink.cards"
                });
            }
            const subscription_id = results[0]['sub_id'];
            stripe.subscriptions.del(
                subscription_id
            )
            .then(cancel_obj => {
                DemoteUserToFree(body,(err,results) => {
                    if(err) 
                    {
                        return res.status(500).json({
                            status: "err",
                            message: "Internal server error, please reach out to customer support on support@onelink.cards"
                        });
                    }
                    return res.status(200).json({
                        status: "success",
                        message: "Subscription Ended"
                    });
                });
            })
            .catch(
                error => {
                    return res.status(500).json({
                        status: "err",
                        message: "Internal server error, please reach out to customer support on support@onelink.cards"
                    });
                }
            )
        });
    }
}