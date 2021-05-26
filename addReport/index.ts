import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

// const sql = require('mssql');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
   
    let role_id: number = (req.query.role_id || (req.body && req.body.role_id)) || null;
    let company_id: number = (req.query.category_id || (req.body && req.body.category_id)) || null;
    let url: string = (req.query.url || (req.body && req.body.url)) || null;
    let description: string = (req.query.description || (req.body && req.body.description)) || null;
    
    const querySpec = {
       text:
       `
       INSERT INTO reports(role_id, company_id, url, description) VALUES ('${role_id}','${company_id}','${url}','${description}')
       `,
    //    values:[category_id]
    }

    try {
        defineModels();
        // Create a pool of connections
        // const pool = new pg.Pool(config);

        // Get a new client connection from the pool
        // const client = await sql.connect(config);

        // Execute the query against the client
        // const result = await client.query(querySpec.text);

        // Release the connection
        // sql.close();

        // Return the query resuls back to the caller as JSON
        context.res = {
            status: 200,
            isRaw: true,
            // body: result.recordsets[0],
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.log(err.message);
    }

};

export default httpTrigger;