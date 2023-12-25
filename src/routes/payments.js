import { Router } from "express";
import PaymentService from '../services/payments.js';

const router = Router();

router.post('/payment-intents', async(req, res) => {

    const paymentIntentInfo = {
        amount: req.amount,
        currency: 'usd'
    }

    const service = new PaymentService();

    let result = await service.createPaymentIntent(paymentIntentInfo);
    console.log(result);

    res.send({status: "success", payload: result});
})

export default router;