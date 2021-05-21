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
    let user_login: string = (req.query.user_login || (req.body && req.body.user_login));

    let password: string = (req.query.password || (req.body && req.body.password));

   const querySpec = {
       text:
        `
        SELECT TOP 1 * FROM users WHERE (username='${user_login}' OR email='${user_login}');
        `        
    }

    context.log(querySpec.text);
    try {
        const client = await sql.connect(config);
        const result = await client.query(querySpec.text);
        const records = result.recordset;
        if (records.length < 1) {
            response(context, { validation:false,message: 'Invalid username/email' });
        }
        else {
            const user = records[0];
            let validation = await validatePassword(password, user.password);
            if (validation) {
                delete user.password;
                response(context, { validation, user });
            } else {
                response(context, { validation, message:'Password is incorrect' })
            }
        }
        
    } catch (err) {
        // if (err.message.includes('Violation of UNIQUE KEY constraint'))
            // response(context, { validation: err.message, message: 'Username or email already taken.'})
    }
};

let validatePassword = async (password, dbpassword) => {
    return await bcrypt.compare(password, dbpassword).then(res => { return res });
}

let response = async (context, data, code=200) => {
    sql.close();
    context.log(data);
    context.res = {
            status: code,
            isRaw: true,
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        };
}
export default httpTrigger;