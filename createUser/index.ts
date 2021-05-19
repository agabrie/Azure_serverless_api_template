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
            // encrypt: true, // for azure
            encrypt: (Boolean) (process.env["dbencrypt"]),
            trustServerCertificate: true // change to true for local dev / self-signed certs
        }
        // ssl: process.env["ssl"]
    };

    let first_name: string = (req.query.first_name || (req.body && req.body.first_name)) || null;
    let last_name: string = (req.query.last_name || (req.body && req.body.last_name))|| null;
    let username: string = (req.query.username || (req.body && req.body.username))|| null;
    let email: string = (req.query.email || (req.body && req.body.email))|| null;
    let role_id: string =(req.query.role_id || (req.body && req.body.role_id))|| null;
    let password: string = (req.query.password || (req.body && req.body.password))|| null;
    // context.log(req);
    let hash:string = await bcrypt.hash(password, 12).then(hash => {
        // context.log(hash);
        return hash;
    });
    const contacts: number[] = (req.query.contacts || (req.body && req.body.contacts));
    
    context.log(`hash => ${hash}`);
    
    const querySpec = {
        text:
            `
            IF (NOT EXISTS(SELECT * from users WHERE (username='${username}' OR email='${email}')))
                BEGIN
                    INSERT INTO users(
                        first_name, last_name, username, email, role_id, password
                    ) values (
                        ${first_name}, ${last_name}, '${username}', '${email}', '${role_id}', '${hash}'
                    )
                END
            ELSE
                BEGIN
                    SELECT 'username or email already exists' as error_message
                END
            `,
        // values: [name, email, role_id]
    }
    
    context.log(querySpec.text);
    try {
        const client = await sql.connect(config);
        const result = await client.query(querySpec.text);
        sql.close();
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