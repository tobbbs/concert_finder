const express = require('express');
const router = express.Router();
const models = require("../models");
const axios = require("axios");
const path = require('path');
const sgMail = require('@sendgrid/mail');
require('dotenv').config({
    path: path.resolve(__dirname, '..', '.env')
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail() {
	const msg = {
	  to: 'test@example.com',
	  from: 'test@example.com',
	  subject: 'Sending with Twilio SendGrid is Fun',
	  text: 'and easy to do anywhere, even with Node.js',
	  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	};
	sgMail.send(msg)
	.then((data) => {
		console.log('email sent', data)
	})
}

sendEmail()