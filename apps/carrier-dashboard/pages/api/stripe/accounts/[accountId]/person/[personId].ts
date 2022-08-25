import { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware, stripe } from '../../../../index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors);
	if (req.method === 'PUT') {
		const token = req.body;
		try {
			const { accountId, personId } = req.query;
			let person = await stripe.accounts.updatePerson(<string>accountId, <string>personId, {
				person_token: token.id
			});
			console.log(person);
			res.status(201).json(person);
		} catch (err) {
			console.log(err);
			res.status(500).json({ statusCode: 500, message: err.message });
		}
	} else {
		res.setHeader('Allow', 'PUT');
		res.status(405).end('Method Not Allowed');
	}
}
