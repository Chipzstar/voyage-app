import { runMiddleware, cors, stripe } from '../index';
import prisma from '../../../db';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { Customer } from 'apps/carrier-dashboard/utils/types';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions)
	const payload: Partial<Customer> = req.body;
	console.log("PAYLOAD", payload)
	const { id } = req.query
	if (req.method === 'POST') {
		try {
			// create stripe customer using input details
			const stripeCustomer = await stripe.customers.create({
				name: payload.fullName,
				phone: payload.phone,
				email: payload.billingEmail,
				address: {
					line1: payload.addressLine1,
					line2: payload.addressLine2,
					city: payload.city,
					postal_code: payload.postcode,
					country: payload.country
				},
				description: payload.companyName,
				metadata: {
					env: process.env.DOPPLER_ENVIRONMENT,
					type: "customer"
				}
			})
			const customer = await prisma.customer.create({
				data: {
					...payload,
					userId: session.id,
					carrierId: payload.carrierId,
					customerId: stripeCustomer.id
				}
			});
			console.log(customer);
			res.json(customer);
		} catch (err) {
			console.log(err)
			res.status(500).send({message:'Internal Server Error. Please try again'});
		}
	}
	else if (req.method === 'PUT'){
		try {
			let { id, ...rest } = payload
			// update stripe details of the customer
			const stripeCustomer = await stripe.customers.update(rest.customerId, {
				name: rest.fullName,
				email: rest.email,
				phone: rest.phone,
				description: rest.companyName,
				address: {
					line1: rest.addressLine1,
					line2: rest.addressLine2,
					city: rest.city,
					postal_code: rest.postcode,
					country: rest.country
				}
			})
			console.log("Stripe Customer", stripeCustomer)
			const customer = await prisma.customer.update({
				where: {
					id
				},
				data: {
					...rest,
				}
			});
			console.log("Prisma Customer", customer);
			res.json(customer);
		} catch (err) {
			console.log(err)
			res.status(400).json({ status: 400, message: 'An error occurred!' })
		}
	}
	else if (req.method === 'DELETE'){
		try {
			// delete customer in db
			const result = await prisma.customer.delete({
				where: {
					id
				}
			});
			console.log(result)
			// delete customer from stripe
			const stripeCustomer = await stripe.customers.del(result.customerId)
			console.log(stripeCustomer)
			res.json({success: true})
		} catch (err) {
			console.error(err)
			res.status(400).json({success: false})
		}
	} else {
		res.status(404).json({ status: 404, message: 'Unrecognised HTTP method used' });
	}
}