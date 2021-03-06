import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { isError } from "util";
import { updateAssociationArray } from "../shared/Models";
var { defineModels, response } = require("../shared/Models");
// const bcrypt = require("bcryptjs");

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	let user_id: number =
		req.query.user_id || (req.body && req.body.user_id) || null;
	// let full_name: string =
	// 	(req.query.full_name || (req.body && req.body.full_name)) || null;

	let username: string =
		req.query.username || (req.body && req.body.username) || null;
	let email: string = req.query.email || (req.body && req.body.email) || null;
	let role_id: number =
		req.query.role_id || (req.body && req.body.role_id) || null;
	// let password: string =
	// 	(req.query.password || (req.body && req.body.password)) || null;
	let company_id: string =
		req.query.company_id || (req.body && req.body.company_id) || null;
	let category_id: string =
		req.query.category_id || (req.body && req.body.category_id) || null;

	// let hash: string = await bcrypt.hash(password, 12).then((hash) => {
	// 	return hash;
	// });

	// let token: string = await bcrypt.hash(email, 12).then((hash) => {
	// 	return hash;
	// });
	console.log(req.body);
	const contacts: number[] =
		req.query.contacts || (req.body && req.body.contacts);

	let { User, Contact } = await defineModels();

	try {
        let user = await User.model.findByPk(user_id, {
            include: [
                User.association.Company
            ]
        });
		// user.full_name = full_name;
		console.log(user);
		if (username != null && username != user.username) {
			user.username = username;
		}
		if (email != null && email != user.email) {
			user.email = email;
		}
		if (role_id != null && role_id != user.roleId) {
			user.roleId = role_id;
		}
		if (company_id != null && company_id != user.companyId) {
			user.companyId = company_id;
		}
		if (category_id != null && category_id != user.categoryId) {
			user.categoryId = category_id;
		}
		// user.roleId = role_id;
		// user.companyId= company_id;
		// user.categoryId = category_id;

		// let user = await User.model.create({
		//     full_name: full_name,
		//     username: username,
		//     email: email,
		//     password: hash,
		//     roleId: role_id,
		//     token: token,
		//     categoryId:category_id
		// }, { include: [User.association.Role,User.association.Category]}
		// );
		// let contact;
		// if (company_id) {
		//     contact = await Contact.model.create({ userId: user.id, companyId: company_id }, {include:[Contact.association.User,Contact.association.Company]});
		// }
		// let user_find = await User.model.findByPk(user.id, { include: [User.association.Role]});
		// if (contact) {
		//     user_find.contact = contact;
		// }
		if (company_id) {
			await updateAssociationArray(
				user.Companies,
				[{ id: company_id }],
				async (company) => {
					let conditions = {
						where: { userId: user.id, companyId: company.id },
					};
					let contact = await Contact.model.findOne(conditions);
					await contact.destroy();
				},
				async (company) => {
					let conditions = {
						where: { userId: user.id, companyId: company.id },
					};
					await Contact.model.findOrCreate(conditions);
				}
			);
		}
        await user.save();
		// let userEdit = await User.model.findByPk(user.id, {
			// include: [User.association.Company],
		// });
        await user.reload();
		response(context, { result: true, user });
	} catch (err) {
		response(context, { result: false, err: err.message });
	}
};

export default httpTrigger;
