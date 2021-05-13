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
    let name: string = req.body && req.body.name;
    let email: string = req.body && req.body.email;
    let role_id: string = req.body && req.body.role_id;
    const contacts:number[] = req.body;
    const querySpec = {
        text: `INSERT INTO users(name, email, role_id) values (${name},${email},${role_id});`,
        values: [name, email, role_id]
    }
    
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