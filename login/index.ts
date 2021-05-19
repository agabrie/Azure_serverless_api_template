import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const sql = require('mssql');
const bcrypt = require('bcrypt');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const config = {
        server: (String)(process.env["dbhost"]),
        user: (String)(process.env["dbuser"]),
        password: (String)(process.env["dbpassword"]),
        database: (String)(process.env["dbname"]),
        port: (Number)(process.env["dbport"]),
        options: {
            encrypt: (Boolean) (process.env["dbencrypt"]),
            trustServerCertificate: true // change to true for local dev / self-signed certs
        }
    };
    let name: string = (req.query.name || (req.body && req.body.name));
    let email: string = (req.query.email || (req.body && req.body.email));
    let password: string = (req.query.password || (req.body && req.body.password));
    // let hashed:string = await bcrypt.hash(password, 12).then(hash => {
    //     // context.log(hash);
    //     return hash;
    // });
   const querySpec = {
       text:
        `
        SELECT 1 FROM users WHERE (username='Alec' OR email='admin@naturesmart');
        `        
    }
    context.log(querySpec.text);
    try {
        // Create a pool of connections
        // const pool = new pg.Pool(config);

        // Get a new client connection from the pool
        const client = await sql.connect(config);

        // Execute the query against the client
        const result = await client.query(querySpec.text);

        // Release the connection
        // sql.close();
        let hashed: string = result.recordset[0];

        // Return the query resuls back to the caller as JSON
        context.log(result);
        context.res = {
            status: 200,
            isRaw: true,
            body: result,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        if (err.message.includes('Violation of UNIQUE KEY constraint'))
        context.res = {
            status: 201,
            isRaw: true,
            body: {
                error: err.message,
                result: 'Username or email already taken.'
            }
        }
        context.log(`error => ${err.message}`);
    }
    sql.on('error', err => {
        // ... error handler
        context.log('ERROR')
        if (err.message.includes('Violation of UNIQUE KEY constraint'))
            context.res = {
                status: 201,
                isRaw: true,
                body: {
                    error: err.message,
                    result: 'Username or email already taken.'
                }
            }
    })

};

export default httpTrigger;