import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { Op } from "sequelize";
var { defineModels, response } = require("../shared/Models");

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	// const category_id:number = (Number) (req.params.category_id);
	const company_id: number = Number(req.query.company_id || (req.body && req.body.company_id));
	const role_id: number = Number(req.query.role_id || (req.body && req.body.role_id));
	// const role_id: number = Number(req.body && req.body.role_id);
	console.log(req.body);

	try {
		let { Report } = await defineModels();
		// let category_include = Company.association.Category;
		// let user_include = Company.association.User;
		// if (category_id) {
		// if (category_id != 3) {
		// category_include.where = {
		// id: category_id
		// [Op.or]: [{ id: category_id }, {id: 3}]
		// }
		// }
		// }
		// if (category_id && category_id != 3) {
		//     include.where = {
		//         [Op.or]: [{ id: category_id }, {id: 3}]
		//     }
		// }
		// console.log(category_include);
		// reports = await Report.model.findByPk(report.id, {
		// include: [
		// Report.association.Role,
		// Report.association.Company
		// ]
		// })
		let role_include = Report.association.Role;
		let company_include = Report.association.Company;
		if (role_id) {
			role_include.where = {
				id: role_id,
			};
		}
		if (company_id) {
			company_include.where = {
				id: company_id,
			};
		}
		let reports = await Report.model.findAll({
			include: [company_include, role_include],
		});
		// console.log(reports)
		// console.log('comapnies', companies);
		// console.log("companies",companies);
		response(context, { result: true, reports });

		// Create a pool of connections
		// const pool = new pg.Pool(config);

		// Get a new client connection from the pool
		// const client = await sql.connect(config);

		// Execute the query against the client
		// const result = await client.query(querySpec);

		// Release the connection
		// sql.close();

		// Return the query resuls back to the caller as JSON
		// context.res = {
		//     status: 200,
		//     isRaw: true,
		//     // body: result.recordsets[0],
		//     headers: {
		//         'Content-Type': 'application/json'
		//     }
		// };
	} catch (err) {
		// context.log(err.message);
		response(context, { result: false, err: err.message });
	}
};

export default httpTrigger;
