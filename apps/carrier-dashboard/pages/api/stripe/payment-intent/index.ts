import { NextApiRequest, NextApiResponse } from 'next';
import { formatAmountForStripe } from '../../../../utils/stripe';
import Stripe from 'stripe';
import { cors, runMiddleware, stripe } from '../../index';
import { CURRENCY } from '@voyage-app/shared-utils';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await runMiddleware(req, res, cors)
	if (req.method === 'POST') {
		const { amount } = req.body;
		try {
			// Create PaymentIntent from body params.
			const formattedAmount = formatAmountForStripe(amount, CURRENCY)
			console.log(formattedAmount)
			const params: Stripe.PaymentIntentCreateParams = {
				payment_method_types: ['card'],
				amount: formattedAmount,
				currency: CURRENCY,
			};
			const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
				params
			);
			res.status(200).json(payment_intent);
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message });
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}