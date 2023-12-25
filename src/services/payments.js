import Stripe from "stripe";

export default class PaymentService{
    constructor() {
        this.stripe = new Stripe('')
    }

    createPaymentIntent = async(data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data);
        return paymentIntent;
    }
}