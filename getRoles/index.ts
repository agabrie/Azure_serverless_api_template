import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const category_id:string = req.query.category_id;
    const querySpec = {
       text:
       `
       SELECT * FROM Roles
       `,
    //    values:[category_id]
    }

    try {
        const { Role } = await defineModels();
        let roles = await Role.model.findAll();
        response(context, {roles});
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
        // context.log(err.message);
    }

};

export default httpTrigger;