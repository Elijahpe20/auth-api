const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
});

const sendVerificationEmail = async (email, code) => {
	const verificationLink = `${process.env.FRONTEND_URL}/verify/${code}`;

	const mailOptions = {
		from: '"Auth API" <noreply@authapi.com>',
		to: email,
		subject: 'Verifica tu cuenta',
		html: `
      <h1>¡Bienvenido!</h1>
      <p>Gracias por registrarte. Por favor verifica tu cuenta haciendo clic en el siguiente enlace:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>O usa este código: <strong>${code}</strong></p>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log('✅ Email enviado correctamente');
	} catch (error) {
		console.error('❌ Error al enviar email:', error);
		throw error;
	}
};

module.exports = { sendVerificationEmail };
