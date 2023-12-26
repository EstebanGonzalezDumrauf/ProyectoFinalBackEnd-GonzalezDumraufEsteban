import Stripe from "stripe";

export default class PaymentService{
    constructor() {
        this.stripe = new Stripe('sk_test_51ORNOME1qJNc5MzAqW2mZ29zo7tQGkCrCccSIBIhDr9iHuBOKaREBSQBYG7o7s6cw3oCks1WiE1NWJYu7WjWWWm900lCFUvi2f')
    }

    createPaymentIntent = async(data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data);
        return paymentIntent;
    }
}