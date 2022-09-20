// import the necessary node libraries
import fs from 'fs';
import puppeteer from 'puppeteer';
import handlers from 'handlebars';
import moment from 'moment';
import { cors, runMiddleware, storage } from '../index';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../db';
import { Carrier, Load } from '../../../utils/types';
import orderId from 'order-id';
import { Invoice, INVOICE_STATUS } from '@voyage-app/shared-types';

const BUCKET = storage.bucket(process.env.GCS_BUCKET_NAME);

function genInvoicePayload(invoiceId, load: Load, profile: Carrier, pdfLocation) {
	return <Invoice>{
		invoiceId,
		items: [
			{
				itemId: load.loadId,
				type: 'carrier',
				periodStart: load.pickup.window.start,
				amountDue: load.rate
			}
		],
		currency: 'GBP',
		status: INVOICE_STATUS.INVOICED,
		total: load.rate * 1.2,
		dueDate: moment().add(7, 'days').unix(),
		billingInfo: {
			name: profile.fullName,
			company: profile.company,
			phone: profile.phone,
			email: profile.email
		},
		pdfLocation
	};
}

const generateV4ReadSignedUrl = (filepath) => {
	return new Promise((resolve, reject) => {
		// These options will allow temporary read access to the file
		const options = {
			version: 'v4',
			action: 'read',
			expires: Date.now() + 604800 * 950 // 7 days
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

export default async (req, res) => {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	const load: Load = JSON.parse(req.body);
	console.log(load)
	const invoiceId = `INV-${orderId(process.env.SECRET).generate()}`;
	const profile: Carrier = await prisma.carrier.findFirst({
		where: {
			id: token?.carrierId
		}
	});
	try {
		// read our invoice-template.html file using node fs module
		const file = fs.readFileSync('./apps/carrier-dashboard/invoice-template.html', 'utf8');
		// compile the file with handlebars and inject the customerName variable
		const template = handlers.compile(`${file}`);
		const html = template({
			customerName: load.customer?.name,
			customerEmail: load.customer?.email,
			customerCompany: load.customer?.company,
			recipientName: profile.fullName,
			recipientEmail: profile.email,
			recipientCompany: profile.company,
			createdAt: moment().format('MMMM D, YYYY'),
			dueOn: moment().add(7, 'days').format('MMMM D, YYYY'),
			invoiceId,
			tripId: load.loadId,
			tripTotal: (load.rate).toFixed(2),
			vat: (load.rate * 0.2).toFixed(2),
			totalDue: (load.rate * 1.2).toFixed(2)
		});
		const filepath = `CARRIERS/${profile.id}/invoices/${invoiceId}.pdf`

		// simulate a chrome browser with puppeteer and navigate to a new page
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		// set our compiled html template as the pages content
		// then waitUntil the network is idle to make sure the content has been loaded
		await page.setContent(html, { waitUntil: 'networkidle0' });
		// convert the page to pdf with the .pdf() method
		const pdf = await page.pdf({ format: 'A4' });
		const gcpFile = BUCKET.file(filepath);
		const result = await gcpFile.save(pdf);
		await browser.close();
		console.log(result);
		console.log(`Invoice ${invoiceId} has been stored at ${filepath}`);
		// generate a signed download URL for the user
		const url = await generateV4ReadSignedUrl(filepath);
		console.log("Download URL: " + url);
		const payload = genInvoicePayload(invoiceId, load, profile, url);
		console.log(payload);
		// create the invoice in db
		const invoice = await prisma.invoice.create({
			data: {
				...payload,
				carrierId: token?.carrierId
			}
		});
		console.log(invoice);
		// send the result to the client
		res.status(200).json(invoice);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};
