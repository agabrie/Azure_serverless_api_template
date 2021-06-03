import { AzureFunction, Context, HttpRequest } from "@azure/functions"
var { defineModels,response } = require("../shared/Models");
// var { defineModels }
// const sql = require('mssql');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const querySpec = {
        text: 'SELECT * FROM users;'
    }
    
    try {
        const { User, Company, Contact } = await defineModels();
        let users = await User.model.findAll({
            attributes: { exclude: ['password', 'token'] },
            include: [
                User.association.Role,
                User.association.Category,
                User.association.Company
            ]
        });
        response(context, {users});
        // Create a pool of connections

        // Get a new client connection from the pool
        // const client = await sql.connect(config);

        // Execute the query against the client
        // const result = await client.query(querySpec);

        // Release the connection
        // sql.close();

        // Return the query resuls back to the caller as JSON
        // context.res = {
            // status: 200,
            // isRaw: true,
            // body: result.recordsets[0],
            // headers: {
                // 'Content-Type': 'application/json'
            // }
        // };
    } catch (err) {
        response(context, { result: false, err: err.message });
        // context.log(err.message);
    }

};

export default httpTrigger;