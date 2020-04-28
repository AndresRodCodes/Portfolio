const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Setup view engine
app.engine('handlebars', exphbs());
app.set('views', './views');
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.resolve(__dirname, 'public')));

// Body Parser Middleware
// Parse application
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Display UI
app.get('/', (req, res) => {
	res.render('index', { layout: false });
});

// Form submit
app.post('/send', (req, res) => {
	// async..await is not allowed in global scope, must use a wrapper
	async function main() {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: process.env.EMAIL, // Gmail email
				pass: process.env.PASSWORD // Gmail app password
			}
		});

		// Send mail with defined transport object
		let info = await transporter.sendMail({
			from: `"${req.body.name}" <${req.body.email}>`, // sender address
			to: 'andres6459@gmail.com', // list of receivers
			subject: `Portfolio - ${req.body.name}`, // Subject line
			text: req.body.message, // plain text body
			html: `<h1>Email: ${req.body.email}</h1>
            <p>${req.body.message}</p>`
		});
		// Email Sent Successfully
		console.log('Message sent: %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

		// Rerender page
		res.render('index', {
			layout: false,
			message: 'Email Sent!'
		});
	}

	main().catch(console.error);
});

app.listen(3000, () => console.log('Server Started...'));
