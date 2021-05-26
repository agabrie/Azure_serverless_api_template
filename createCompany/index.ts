import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    // context.log('HTTP trigger function processed a request.');
    // const name = (req.query.name || (req.body && req.body.name));
    // const email = (req.query.email || (req.body && req.body.email));
    // const role_id = (req.query.role_id || (req.body && req.body.role_id));
    // const { name } = req.body || req.query;
    let name: string = (req.query.name || (req.body && req.body.name));
    let category_id: string = (req.query.category_id || (req.body && req.body.category_id));

    // context.log(req.body,req.query);
    // const contacts = req.body;
    const querySpec = {
        text: `INSERT INTO companies(name,category_id) values (${name},${category_id})`,
        values: [name,category_id]
    }
    
    try {
        const { Company } = await defineModels();
        let company = await Company.model.create({ name: name, categoryId: category_id }, { include: [Company.association.Category] });
        let company_find = await Company.model.findByPk(company.id,  { include: [Company.association.Category] })
        console.log(company);
        response(context, { company:company_find });
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
        // context.res = {
        //     body: err.message,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }
        // context.log(err.message);
        response(context, {result:false, err:err.message})
    }
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };

};

export default httpTrigger;