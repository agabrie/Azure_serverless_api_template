import { AzureFunction, Context, HttpRequest } from "@azure/functions"

var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	let report_id: number =
			req.query.report_id || (req.body && req.body.report_id) || null;
  
	try {
		const { Report, ReportRole, ReportCompany } = await defineModels();
		let reportRoles = await ReportRole.model.findAll({
			where: { reportId: report_id },
		});
		reportRoles.forEach((role) => {
			role.destroy();
		});
		let reportCompanies = await ReportCompany.model.findAll({
			where: { reportId: report_id },
		});
		reportCompanies.forEach((company) => {
			company.destroy();
		});
		let report = await Report.model.findByPk(report_id);
		await report.destroy();
		response(context, {result:true,message:'report successfully removed'});

	} catch (err) {
		response(context, {
			result: true,
			message: "removal of report was unsuccessful",
		});

	}

};

export default httpTrigger;