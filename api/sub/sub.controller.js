const {
    createsubscription,
    GetSubscriptionId,
    DemoteUserToFree,
    UpdateStripeCustomerInDatabase
} = require('./sub.service');
const stripe = require('stripe')(process.env.STRIP_SK);
module.exports = {
    CreatePaymentIntent:(req,res) => {
        let body = req.body;
        const u_uid = req.params.id;
        stripe.paymentIntents.create({
            amount: body.amount,
            currency: body.currency,
            payment_method: body.paymentMethodId,
            customer: body.customerId,
            setup_future_usage:off_session,
            description: 'Buying software service subscription for pro access on onelink.cards platform'
        })
        .then(
            paymentIntentObj => {
                return res.status(200).json({
                    status: "success",
                    IntentObj: paymentIntentObj,
                    display_message:"Payment intent created, await confirmation!!"
                });
            }
        )
        .catch(
            error => {
                return res.status(500).json({
                    status: "err",
                    message: error,
                    display_message:"We cannot create your subscription, please reach out to support on support@onelink.cards"
                });
            }
        )
    },
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
                .catch(
                    error => {
                        return res.status(500).json({
                            status: "err",
                            error_obj : error,
                            message: "Internal server err, please reach out to our support team on support@onelink.cards"
                        });
                    }
                )
            }
        )
        .catch(
            error => {
                return res.status(500).json({
                    status: "err",
                    error_obj : error,
                    message: "Internal server err, please reach out to our support team on support@onelink.cards"
                });
            }
        )
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
    },
    UpdateStripeCustomer:(req,res) => {
        var customer_id = req.params.id;
        const body = req.body;
        body.customer_id = customer_id;
        stripe.customers.update(
            customer_id,
            {
                address: {
                    postal_code: body.zipcode,
                    city: body.city,
                    state: body.state,
                    country: body.countryiso
                }
            }
        )
        .then(
            result => {
                UpdateStripeCustomerInDatabase(body,(err,results) => {
                    if(err)
                    {
                        return res.status(500).json({
                            status: "err",
                            message: err,
                            display_message : "Internal server error, reach out to support on support@onelink.cards"
                        }); 
                    }
                    return res.status(200).json({
                        status  :   "success",
                        message :   result,
                        display_message: "Customer Updated"
                    });
                });
            }
        )
        .catch(
            error => {
                return res.status(500).json({
                    status: "err",
                    message: error,
                    display_message : "Internal server error,please reach out to support team on support@onelink.cards"
                });
            }
        )
    }
}