import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { addUserRoutes } from './app/routes/auth';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/server', (req, res) => {
	res.send({ message: 'Welcome to backend!' });
});
addUserRoutes(app);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}/server`);
});
server.on('error', console.error);
