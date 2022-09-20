// Run the middleware
import { getToken } from 'next-auth/jwt';
import { cors, runMiddleware, storage } from '../index';
import prisma from '../../../db';

const BUCKET = storage.bucket(process.env.GCS_BUCKET_DOCUMENTS);

const generateV4ReadSignedUrl = (filepath) => {
	return new Promise((resolve, reject) => {
		// These options will allow temporary read access to the file
		const options = {
			version: 'v4',
			action: 'read',
			expires: Date.now() + 604800 * 900 // 7 days
		};
		// Get a v4 signed URL for reading the file
		const file = BUCKET.file(filepath);
		console.log(file);
		// @ts-ignore
		file.getSignedUrl(options, function(err, url) {
			if (err) {
				console.error(err);
				reject(err);
			}
			console.log('Generated GET signed URL:');
			console.log('URL', url);
			console.log('You can use this URL with any user agent, for example:');
			resolve(url);
		});
	});
};

export default async function handler(req, res) {
	await runMiddleware(req, res, cors);
	const token = await getToken({ req });
	const payload = req.body;
	console.log(payload);
	if (req.method === 'POST') {
		try {
			// generate a signed download URL for the user
			const localFilename = '/Users/chiso/Downloads/test.pdf';
			const url = await generateV4ReadSignedUrl(payload.filepath);
			// create document in db using download url in location field of document in db
			const document = await prisma.document.create({
				data: {
					carrierId: token?.carrierId,
					location: url,
					...payload
				}
			});
			console.log(document);
			console.log(`gs://${process.env.GCS_BUCKET_DOCUMENTS}/${payload.filepath} downloaded to ${localFilename}.`);
			res.status(200).json(document);
		} catch (e) {
			console.error(e);
			res.status(500).send({ message: e?.message ? e.message : 'Internal Server Error. Please try again' });
		}
	}
	else if (req.method === 'DELETE') {
		const { id, filepath } = req.query;
		console.log('File path: ' + filepath);
		try {
			// delete the document from gcp
			const file = BUCKET.file(filepath);
			let result = await file.delete();
			console.log(result[0].body.toJSON());
			// delete the document from db
			result = await prisma.document.delete({
				where: {
					id
				}
			});
			res.status(200).json(result);
		} catch (e) {
			console.error(e);
			res.status(500).json(e);
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}