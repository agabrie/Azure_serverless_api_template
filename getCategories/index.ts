import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    const category_id: string = req.query.category_id;
    const querySpec = {
        text:
            `
       SELECT * FROM Categories
       `,
        values: [category_id]
    }
    const { Category } = await defineModels();
    try {
        let categories = await Category.model.findAll();
        response(context, { categories });
        // Create a pool of connections
        // const pool = new pg.Pool(config);

        // Get a new client connection from the pool
        // const client = await sql.connect(config);

        // Execute the query against the client
        // const result = await client.query(querySpec.text);

        // Release the connection
        // sql.close();

        // Return the query resuls back to the caller as JSON
        
    } catch (err) {
        response(context, { result:true,err:err.message });
    }

};

export default httpTrigger;