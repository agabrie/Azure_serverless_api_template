const nodemailer = require("nodemailer");
let smtpMail = async (
	to = "bar@example.com, baz@example.com",
	subject="Hello ✔",
	text= "Hello world?",
	html="<b>Hello world?</b>",
	// from = '"Fred Foo 👻" <foo@example.com>',
) => {
	let mail_user: string = String(process.env["mail-user"]);
	let mail_password: string = String(process.env["mail-password"]);
	let mail_port: number = Number(process.env["mail-port"]);
	let mail_host: string = String(process.env["mail-host"]);
	let mail_address: string = (String)(process.env["mail-address"]);
	let mail_secure: boolean = mail_port == 465;
	// let testAccount = await nodemailer.createTestAccount();

	// create reusable transporter object using the default SMTP transport
	let transport_config = {
		host: mail_host,
		port: mail_port,
		secure: mail_secure, // true for 465, false for other ports
		auth: {
			user: mail_user, // generated ethereal user
			pass: mail_password, // generated ethereal password
		},
	};
	// console.log("create transport => ",transport_config)
	let transporter = await nodemailer.createTransport(transport_config);
	let mail_config = {
		from: mail_address, // sender address
		to: to, // list of receivers
		subject: subject, // Subject line
		text: text, // plain text body
		html: html, // html body
	};
	// send mail with defined transport object
	// console.log("transport created successfully !!! => ", transporter);
	console.log("configure Mail => ", mail_config);

	let info = await transporter.sendMail(mail_config);

	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	return info;
};
export default { smtpMail };
export { smtpMail };
