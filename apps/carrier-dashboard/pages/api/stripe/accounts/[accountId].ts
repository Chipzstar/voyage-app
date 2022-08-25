import { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware, stripe } from '../../index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors);
	if (req.method === 'PUT') {
		try {
			const { accountId } = req.query;
			const token = req.body
			let account = await stripe.accounts.update(<string>accountId, {
				account_token: token.id
			});
			console.log(account);
			res.status(201).json(account);
		} catch (err) {
			console.log(err);
			res.status(500).json({ statusCode: 500, message: err.message });
		}
	} else {
		res.setHeader('Allow', 'PUT');
		res.status(405).end('Method Not Allowed');
	}
}
