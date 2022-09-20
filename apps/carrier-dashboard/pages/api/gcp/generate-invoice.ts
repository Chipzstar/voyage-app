// import the necessary node libraries
import fs from 'fs';
import path from 'path'
import puppeteer from 'puppeteer';
import handlers from 'handlebars';
import moment from 'moment';
import { cors, runMiddleware, storage } from '../index';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../db';
import { Carrier, Load } from '../../../utils/types'
import orderId from 'order-id';

const BUCKET = storage.bucket(process.env.GCS_BUCKET_NAME);

export default async (req, res) => {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	const load: Load = JSON.parse(req.body);
	const invoiceId = `INV-${orderId(process.env.SECRET).generate()}`
	const profile: Carrier = await prisma.carrier.findFirst({
		where: {
			id: token?.carrierId
		}
	})
	try {
		// read our invoice-template.html file using node fs module
		const file = fs.readFileSync('./apps/carrier-dashboard/invoice-template.html','utf8');

		// compile the file with handlebars and inject the customerName variable
		const template = handlers.compile(`${file}`);
		const html = template({
			customerName: profile.fullName,
			email: profile.email,
			company: profile.company,
			createdAt: moment().format("MMMM D, YYYY"),
			// provide 7 day grace period
			dueOn: moment().add(7, "days").format("MMMM D, YYYY"),
			invoiceId,
			tripId: load.loadId,
			tripTotal: load.rate,
			vat: (load.rate * 0.2).toFixed(2),
			totalDue: (load.rate * 1.2).toFixed(2)
		});

		// simulate a chrome browser with puppeteer and navigate to a new page
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		// set our compiled html template as the pages content
		// then waitUntil the network is idle to make sure the content has been loaded
		await page.setContent(html, { waitUntil: 'networkidle0' });
		// convert the page to pdf with the .pdf() method
		const pdf = await page.pdf({ format: 'A4' });
		const gcpFile = BUCKET.file(`CARRIERS/${profile.id}/invoices/${invoiceId}.pdf`)
		gcpFile.save(pdf, (err) => {
			if (!err) {
				console.log("cool");
			} else {
				console.log("error " + err);
			}
		});
		await browser.close();
		// send the result to the client
		res.statusCode = 200;
		res.send(pdf);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};