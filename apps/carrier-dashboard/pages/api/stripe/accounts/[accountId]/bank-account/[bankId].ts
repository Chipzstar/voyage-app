import { cors, runMiddleware, stripe } from '../../../../index';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../../db';
import { getToken } from 'next-auth/jwt';
import { BankAccountForm } from '../../../../../../utils/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors);
	const token = await getToken({ req })
	if (req.method === 'PUT') {
		const { accountId, bankId } = req.query;
		const payload: Partial<BankAccountForm> = req.body;
		console.log('Account Id', accountId);
		console.log('Bank id', bankId);
		console.log("Payload", payload)
		try {
			// update stripe bank details
			const bankAccount = await stripe.accounts.updateExternalAccount(<string>accountId, <string>bankId, {
				account_holder_name: payload.accountHolderName,
			})
			console.log(bankAccount)
			console.log('************************************************');
			// update the stripe details in db
			const updatedCarrier = await prisma.carrier.update({
				where: {
					id: token?.id
				},
				data: {
					stripe: {
						bankAccount: {
							accountHolderName: payload.accountHolderName
						}
					}
				}
			})
			console.log(updatedCarrier)
			res.status(200).json(updatedCarrier);
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message });
		}
	} else {
		res.setHeader('Allow', 'PUT');
		res.status(405).end('Method Not Allowed');
	}
}