const mailjet = require("node-mailjet").connect(
	"dc69e5f3465ff7d4c8f83c6611215bd4",
	"6479f502efcee44421ee73825e3b4bc3"
);

const sendMail = async (
	to = [
		{
			Email: "abduraghmaangabriels2@gmail.com",
			Name: "Abduraghmaan",
		},
	],
	subject = "MailJet Test",
	message= {
		text: "My first Mailjet email",
		html: "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!"
	},
	from = {
		email: "abduraghmaan.gabriels@lavalamp.biz",
		name: "Abduraghmaan",
	}
) => {
	console.log({ from, to, subject });
	const request = await mailjet
		.post("send", { version: "v3.1" })
		.request({
			Messages: [
				{
					From: {
						Email: from.email,
						Name: from.name,
					},
					To: to,
					Subject: subject,
					TextPart: message.text,
					HTMLPart:message.html,
					CustomID: "AppGettingStartedTest",
				},
			],
		})
		// request
		.then((result) => {
			console.log(result.body.Messages);
			return result;
		})
		.catch((err) => {
			console.log("Error!", err.statusCode);
		});
	console.log(request);
	return request;
};
export default { sendMail };
export { sendMail };
