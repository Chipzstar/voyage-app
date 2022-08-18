import { cors, runMiddleware, stripe } from '../../index';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await runMiddleware(req, res, cors)
	if (req.method === 'PUT') {
		const { id } = req.query;
		const payload = req.body;
		console.log(id, payload)
		try {
			// Attach the payment method to the customer.
			const result = await stripe.paymentMethods.attach(<string>id, {
				...payload
			})
			console.log(result)
			res.status(200).json(result);
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message });
		}
	} else {
		res.setHeader('Allow', 'PUT');
		res.status(405).end('Method Not Allowed');
	}
}