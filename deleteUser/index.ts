import { AzureFunction, Context, HttpRequest } from "@azure/functions";
var { defineModels, response } = require("../shared/Models");

const httpTrigger: AzureFunction = async function ( context: Context, req: HttpRequest ): Promise<void> {
	let user_id: number =
		req.query.user_id || (req.body && req.body.user_id) || null;
	console.log(user_id);
	try {
		const { User, Contact } = await defineModels();

		let contacts = await Contact.model.findAll({ where: { userId: user_id } });

		contacts.forEach((contact) => {
			contact.destroy();
		});
		let user = await User.model.findByPk(user_id);

		await user.destroy();
		response(context, { result: true, message: "user successfully removed" });
	} catch (err) {
		response(context, {
			result: true,
			message: "removal of user was unsuccessful",
		});
	}
};

export default httpTrigger;
