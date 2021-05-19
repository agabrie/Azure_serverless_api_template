import { AzureFunction, Context, HttpRequest } from "@azure/functions"


const sql = require('mssql');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // const client = df.getClient(context);
    // const instanceId = await client.startNew('TestOrchestrator', undefined, req.body);

    // context.log(`Started orchestration with ID = '${instanceId}'.`);

    // return client.createCheckStatusResponse(context.bindingData.req, instanceId);

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

   const querySpec = {
       text:
        `
        IF (EXISTS (SELECT * FROM sys.tables WHERE name='companies'))
            DROP TABLE companies;
        IF (EXISTS (SELECT * FROM sys.tables WHERE name='users'))
            DROP TABLE users;
        IF (EXISTS (SELECT * FROM sys.tables WHERE name='categories'))
            DROP TABLE categories;
        IF (EXISTS (SELECT * FROM sys.tables WHERE name='roles'))
            DROP TABLE roles;
        `
    }

    try {
        // Create a pool of connections
        const client = await sql.connect(config);

        // Get a new client connection from the pool
        // const client = await pool.connect();

        // Execute the query against the client
        const result = await client.query(querySpec.text);

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