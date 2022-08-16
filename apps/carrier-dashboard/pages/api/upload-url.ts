import { cors, runMiddleware } from './index'
import { Storage } from '@google-cloud/storage';
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions)
	const token = await getToken({req})
	const { id, filename, type } = req.query;
	const storage = new Storage({
		projectId: process.env.GCS_PROJECT_ID,
		credentials: {
			client_email: process.env.GCS_CLIENT_EMAIL,
			private_key: process.env.GCS_PRIVATE_KEY,
		},
	});
	try {
		const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
		const filepath = `${id ?? token?.carrierId}/${type}/${filename}`
		const file = bucket.file(filepath);
		console.log(file)
		console.log(`${filename} uploaded to ${process.env.GCS_BUCKET_NAME}`);
		const options = {
			expires: Date.now() + 5 * 60 * 1000, //  1 minute,
			fields: { 'x-goog-meta-test': 'data' },
		};
		const [response] = await file.generateSignedPostPolicyV4(options);
		console.log(response)
		res.status(200).json(response);
	} catch (e) {
		res.status(500).send({message: e?.message ? e.message :'Internal Server Error. Please try again'});
	}
}