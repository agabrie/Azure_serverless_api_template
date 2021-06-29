import { AzureFunction, Context, HttpRequest } from "@azure/functions"
// import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let report_id: number =
			req.query.report_id || (req.body && req.body.report_id) || null;
  
    try {
        const { Report } = await defineModels();
        let report = await Report.model.findByPk(report_id);
        await report.destroy();
        response(context, {result:true,message:'report successfully removed'});
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
        response(context, {
					result: true,
					message: "removal of report was unsuccessful",
				});

        // context.log(err.message);
    }

};

export default httpTrigger;