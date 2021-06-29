import { AzureFunction, Context, HttpRequest } from "@azure/functions"
// import { report } from "process";
// import { Op } from 'sequelize';
// import { Company } from "../shared/Company";
// import { ReportCompany } from "../shared/ReportCompany";
var { defineModels, response, updateAssociationArray } = require('../shared/Models');

// const sql = require('mssql');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	
	let id: number = (req.query.id || (req.body && req.body.id)) || null;
	// let role_id: number = (req.query.role_id || (req.body && req.body.role_id)) || null;
	let name: number = (req.query.name || (req.body && req.body.name)) || null;
	let companies: any[] = (req.query.companies || (req.body && req.body.companies)) || null;
	let roles: any[] = (req.query.roles || (req.body && req.body.roles)) || null;
	let url: string = (req.query.url || (req.body && req.body.url)) || null;
	let description: string = (req.query.description || (req.body && req.body.description)) || null;
	let report_id: string = (req.query.report_id || (req.body && req.body.report_id)) || null;
	let workspace_id: string = (req.query.workspace_id || (req.body && req.body.workspace_id)) || null;

	console.log(req.body);

	try {
		let { Report, ReportCompany,ReportRole } = await defineModels();
		let report = null;
			report = await Report.model.findByPk(id, {
				include: [
					Report.association.Role,
					Report.association.Company
				]
			})
		if (name!=null && name != report.name) {
			report.name = name;
		}
		if (url!=null && url != report.url) {
			report.url = url;
		}
		if (description!=null && description != report.description) {
			report.description = description;
		}
		if (report_id != null && report_id != report.report_id) {
			report.report_id = report_id;
		}
		if (workspace_id != null && workspace_id != report.workspace_id) {
			report.workspace_id = workspace_id;
		}
		await updateAssociationArray(report.Roles, roles,
			async (role) => {
				let conditions = { where: { reportId: report.id, roleId: role.id } }
				let roleRecord = await ReportRole.model.findOne(conditions)
				await roleRecord.destroy()
			},
			async (role) => {
				let conditions = { where: { reportId: report.id, roleId: role.id } }
				await ReportRole.model.findOrCreate(conditions)
			}
		);

		await updateAssociationArray(report.Companies, companies,
			async (company) => {
				let conditions = { where: { reportId: report.id, companyId: company.id } }
				let companyRecord = await ReportCompany.model.findOne(conditions)
				await companyRecord.destroy()
			},
			async (company) => {
				let conditions = { where: { reportId: report.id, companyId: company.id } }
				await ReportCompany.model.findOrCreate(conditions)
			}
		);

		// let nuRoles = getAllNew(report.Roles,roles,'id')
		// let rolesToDelete = getAllExcluded(report.Roles,roles,'id')
		// console.log("new", nuRoles)
		// console.log("to Delete",rolesToDelete)
		
		// await rolesToDelete.forEach(async role => {
		//     let roleRecord = await ReportRole.model.findOne({ where: { roleId: role.id, reportId: report.id } })
		//     await roleRecord.destroy();
		// });
		// await nuRoles.forEach(async role => {
		//     console.log('Role to Add =>', { role })
		//     await ReportRole.model.findOrCreate({where: { reportId: report.id, roleId: role.id }})
		// });

		await report.save();

		// let reportEdit = await Report.model.findByPk(report.id, {
		// 		include: [
		// 			Report.association.Role,
		// 			Report.association.Company
		// 		]
		// })
		await report.reload();
		// console.log(report.description,reportEdit.description)
		response(context, {result:true, report })
		
	} catch (err) {
		response(context, { result: false, err: err.message });

	}

};


export default httpTrigger;