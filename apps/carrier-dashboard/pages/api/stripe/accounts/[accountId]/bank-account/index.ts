import { cors, runMiddleware, stripe } from '../../../../index';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../../db';
import { getToken } from 'next-auth/jwt';
import { BankAccountForm } from '../../../../../../utils/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors);
	const jwtToken = await getToken({ req })
	if (req.method === 'POST') {
		const { accountId } = req.query;
		const payload: Partial<BankAccountForm> = req.body;
		console.log('Account Id', accountId);
		console.log("Payload", payload)
		try {
			// create bank account token
			const token = await stripe.tokens.create({
				bank_account: {
					country: payload.country,
					currency: payload.currency.toLowerCase(),
					account_holder_name: payload.accountHolderName,
					account_holder_type: 'company',
					routing_number: payload.sortCode,
					account_number: payload.last4,
				},
			});
			console.log("TOKEN", token)
			// update stripe bank details
			const bankAccount = await stripe.accounts.createExternalAccount(<string>accountId, {
				external_account: token.id
			})
			console.log('-----------------------------------------------');
			console.log(bankAccount)
			console.log('************************************************');
			// update the stripe details in db
			if (bankAccount.object !== 'card') {
				const updatedCarrier = await prisma.carrier.update({
					where: {
						id: jwtToken?.carrierId
					},
					data: {
						stripe: {
							bankAccount: {
								id: bankAccount.id,
								fingerprint: bankAccount.fingerprint,
								sortCode: bankAccount.routing_number,
								last4: bankAccount.last4,
								accountHolderName: bankAccount.account_holder_name,
								currency: bankAccount.currency,
								country: bankAccount.country,
								status: bankAccount.status
							}
						}
					}
				});
				console.log(updatedCarrier)
				res.status(200).json(updatedCarrier);
			}
			res.status(400).json({ statusCode: 400, message: "Wrong External Account of type 'card' was created" })
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message });
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}