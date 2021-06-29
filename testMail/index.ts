import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { sendMail } from "../shared/mail";
import { smtpMail } from "../shared/smtp";
import { response } from "../shared/Models";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	let to: string|string[] = (req.query.to || (req.body && req.body.to)) || null;
	// let from: any = (req.query.from || (req.body && req.body.from)) || null;
	// let request = await sendMail( [{
	// 	"Email": to.email,
	// 	"Name": to.name
	// }]);
	if(Array.isArray(to))
		to = to.join(",");
	let mailer = await smtpMail(to, 'Test SMTP Mail', 'Hello There', '<a href="google.com">link</a>');
	response(context, {message:'test mail called',mailer});
};

export default httpTrigger;