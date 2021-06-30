import { AzureFunction, Context, HttpRequest } from "@azure/functions"
var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
   
    // let role_id: number = (req.query.role_id || (req.body && req.body.role_id)) || null;
    let name: number = (req.query.name || (req.body && req.body.name)) || null;
    let companies: any[] = (req.query.companies || (req.body && req.body.companies)) || null;
    let roles: any[] = (req.query.roles || (req.body && req.body.roles)) || null;
    let url: string = (req.query.url || (req.body && req.body.url)) || null;
    let description: string = (req.query.description || (req.body && req.body.description)) || null;
    let report_id: string = (req.query.report_id || (req.body && req.body.report_id)) || null;
    let workspace_id: string = (req.query.workspace_id || (req.body && req.body.workspace_id)) || null;
    let category_id: number = Number(req.query.category_id || (req.body && req.body.category_id))||null;
   

    try {
        let { Report, ReportCompany,ReportRole } = await defineModels();
        let reports = [];
       
        let conditions = {
					where: {
						name: name,
						// roleId: role_id,
						// companyId: company.id,
						url: url,
						workspaceId: workspace_id,
						reportId: report_id,
						description: description,
						categoryId: category_id,
					},
				};
            let report = await Report.model.findOrCreate(conditions);
            report = report[0];
            console.log(report)
            await companies.forEach(async company => {
                await ReportCompany.model.findOrCreate({ where: { reportId: report.id, companyId: company.id }})
            });
            await roles.forEach(async role => {
                await ReportRole.model.findOrCreate({where: { reportId: report.id, roleId: role.id }})
            });
             
            reports = await Report.model.findByPk(report.id, {
                include: [
                    Report.association.Role,
                    Report.association.Company
                ]
            })
            response(context, {result:true, reports })
        
    } catch (err) {
        context.log(err.message);
    }

};

export default httpTrigger;