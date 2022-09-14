import { cors, runMiddleware, storage } from '../index';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	const { filepath } = req.query;
	console.log("File path: " + filepath);
	if (req.method === "DELETE") {
		try {
			const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
			const file = bucket.file(filepath);
			const result = await file.delete()
			console.log(result[0].body)
			res.status(200).json(result)
		} catch (e) {
			console.error(e)
			res.status(500).json(e);
		}
	} else {
		res.setHeader('Allow', 'DELETE');
		res.status(405).end('Method Not Allowed');
	}
}