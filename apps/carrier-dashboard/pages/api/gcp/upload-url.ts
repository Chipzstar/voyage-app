import { cors, runMiddleware, storage } from '../index';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	const { id, filename, type } = req.query;

	try {
		const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
		const filepath = `${id ?? token?.carrierId}/${type}/${filename}`;
		const file = bucket.file(filepath);
		console.log(`${filename} uploaded to ${process.env.GCS_BUCKET_NAME}`);
		const options = {
			expires: Date.now() + 5 * 60 * 1000, //  1 minute,
			fields: { 'x-goog-meta-test': 'data' }
		};
		const [response] = await file.generateSignedPostPolicyV4(options);
		console.log(response);
		res.status(200).json(response);
	} catch (e) {
		res.status(500).send({ message: e?.message ? e.message : 'Internal Server Error. Please try again' });
	}
}