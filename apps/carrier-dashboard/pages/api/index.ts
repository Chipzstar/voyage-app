import Cors from 'cors'
import Stripe from 'stripe';
import { Storage } from '@google-cloud/storage';

// Initializing the cors middleware
export const cors = Cors({
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
})

// Initialize stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01'
});

// Initialize GCP storage client
export const storage = new Storage({
	projectId: process.env.GCS_PROJECT_ID,
	credentials: {
		client_email: process.env.GCS_CLIENT_EMAIL,
		private_key: process.env.GCS_PRIVATE_KEY
	}
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result)
			}
			return resolve(result)
		})
	})
}