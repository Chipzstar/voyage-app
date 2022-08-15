import { cors, runMiddleware } from './index'
import { Storage } from '@google-cloud/storage';
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions)
	console.log(session)
	const storage = new Storage({
		projectId: process.env.GCP_PROJECT_ID,
		credentials: {
			client_email: process.env.GCP_CLIENT_EMAIL,
			private_key: process.env.GCP_PRIVATE_KEY,
		},
	});
	console.log(storage)
	const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);
	const file = bucket.file(req.query.file);
	const options = {
		expires: Date.now() + 1 * 60 * 1000, //  1 minute,
		fields: { 'x-goog-meta-test': 'data' },
	};

	const [response] = await file.generateSignedPostPolicyV4(options);
	res.status(200).json(response);
}