import { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware, stripe } from '../../../../index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors);
	if (req.method === 'POST') {
		try {
			const { accountId } = req.query;
			const { id } = req.body;
			const person = await stripe.accounts.createPerson(
				<string>accountId, // id of the account created earlier
				{
					person_token: id
				}
			);
			console.log(person);
			res.status(201).json(person);
		} catch (err) {
			console.log(err);
			res.status(500).json({ statusCode: 500, message: err.message });
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}