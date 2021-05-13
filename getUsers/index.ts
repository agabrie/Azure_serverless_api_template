import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const sql = require('mssql');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const config = {
        server: process.env["dbhost"],
        user: process.env["dbuser"],
        password: process.env["dbpassword"],
        database: process.env["dbname"],
        port: process.env["dbport"],
        encrypt: process.env["dbencrypt"],
        // ssl: process.env["ssl"]
    };

   const querySpec = {
        text: 'SELECT * FROM users;'
    }

    try {
        // Create a pool of connections

        // Get a new client connection from the pool
        const client = await sql.connect(config);

        // Execute the query against the client
        const result = await client.query(querySpec);

        // Release the connection
        sql.close();

        // Return the query resuls back to the caller as JSON
        context.res = {
            status: 200,
            isRaw: true,
            body: result.recordsets[0],
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.log(err.message);
    }

};

export default httpTrigger;