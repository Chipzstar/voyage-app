import { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware, stripe } from '../../index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors);
	if (req.method === 'POST') {
		try {
			const { id } = req.body;
			const account = await stripe.accounts.create({
				country: 'GB',
				type: 'custom',
				capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
				account_token: id
			});
			console.log(account);
			res.status(201).json(account);
		} catch (err) {
			console.log(err)
			res.status(500).json({ statusCode: 500, message: err.message });
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}
