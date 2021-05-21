import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const sql = require('mssql');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const config = {
        server: (String)(process.env["dbhost"]),
        user: (String)(process.env["dbuser"]),
        password: (String)(process.env["dbpassword"]),
        database: (String)(process.env["dbname"]),
        port: (Number)(process.env["dbport"]),
        options: {
            // encrypt: true, // for azure
            encrypt: (Boolean) (process.env["dbencrypt"]),
            trustServerCertificate: true // change to true for local dev / self-signed certs
        }
        // ssl: process.env["ssl"]
    };
    const category_id:string = req.query.category_id;
    const querySpec = {
       text:
       `
       SELECT * FROM Companies
       INNER JOIN Categories
       ON companies.category_id = Categories.id
       WHERE companies.category_id = ${category_id}
       `,
       values:[category_id]
    }

    try {
        // Create a pool of connections
        // const pool = new pg.Pool(config);

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