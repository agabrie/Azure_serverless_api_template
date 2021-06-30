import { AzureFunction, Context, HttpRequest } from "@azure/functions"
// import { Op } from 'sequelize';
// import { Company } from "../shared/Company";
// import { ReportCompany } from "../shared/ReportCompany";
var { defineModels, response } = require('../shared/Models');

// const sql = require('mssql');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
   
    let role_id: number = (req.query.role_id || (req.body && req.body.role_id)) || null;
    let name: number = (req.query.name || (req.body && req.body.name)) || null;
    let companies: any[] = (req.query.companies || (req.body && req.body.companies)) || null;
    let roles: any[] = (req.query.roles || (req.body && req.body.roles)) || null;
    let url: string = (req.query.url || (req.body && req.body.url)) || null;
    let description: string = (req.query.description || (req.body && req.body.description)) || null;
    let report_id: string = (req.query.report_id || (req.body && req.body.report_id)) || null;
    let workspace_id: string = (req.query.workspace_id || (req.body && req.body.workspace_id)) || null;
    let category_id: number = Number(req.query.category_id || (req.body && req.body.category_id))||null;
    // console.log(req.body);
    // const querySpec = {
    //    text:
    //    `
    //    INSERT INTO reports(role_id, company_id, url, description) VALUES ('${role_id}','${company_id}','${url}','${description}')
    //    `,
    //    values:[category_id]
    // }

    try {
        let { Report, ReportCompany,ReportRole } = await defineModels();
        let reports = [];
        // if (companies.length > 0 && roles.length > 0) {
            // companies.forEach(async company => {
                // console.log(company);
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
                // reports.push(report)
            
            // });
            // console.log(reports);
            reports = await Report.model.findByPk(report.id, {
                include: [
                    Report.association.Role,
                    Report.association.Company
                ]
            })
            response(context, {result:true, reports })
        // } else {

        //     response(context, {
        //         err: 'Invalid data'
        //     })
        // }

        
        // Create a pool of connections
        // const pool = new pg.Pool(config);

        // Get a new client connection from the pool
        // const client = await sql.connect(config);

        // Execute the query against the client
        // const result = await client.query(querySpec.text);

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
        context.log(err.message);
    }

};

export default httpTrigger;