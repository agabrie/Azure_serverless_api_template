import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { User } from "../shared/User";
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
    let role_id: number =(req.query.role_id || (req.body && req.body.role_id))|| null;
    let password: string = (req.query.password || (req.body && req.body.password))|| null;
    context.log(password);
    let hash:string = await bcrypt.hash(password, 12).then(hash => {return hash;});
    context.log(`hash =>${hash}`)
    let token: string = await bcrypt.hash(email, 12).then(hash => { return hash; });
    context.log(`token => ${token}`)
    const contacts: number[] = (req.query.contacts || (req.body && req.body.contacts));
    
    context.log(`hash => ${hash}`);
    
    const querySpec = {
        text:
            `
            IF (NOT EXISTS(SELECT * from users WHERE (username='${username}' OR email='${email}')))
                BEGIN
                    INSERT INTO users(
                        first_name, last_name, username, email, role_id, password,token
                    ) values (
                        '${first_name}', '${last_name}', '${username}', '${email}', '${role_id}', '${hash}','${token}'
                    )
                    SELECT TOP 1 * FROM USERS WHERE (username='${username}' OR email='${email}');
                END
            ELSE
                BEGIN
                    SELECT 'username or email already exists' as error_message
                END
            `,
        // values: [name, email, role_id]
    }
    User.model.create({first_name:first_name,last_name:last_name,username:username,email:email,password:hash,role:role_id,token:token}); //fix the role association
    // context.log(querySpec.text);
    // try {
    //     const client = await sql.connect(config);
    //     const result = await client.query(querySpec.text);
    //     let data = result.recordset[0];
    //     if (data.error_message) {
    //         response(context, { result: false, message: data.error_message })
    //     } else {
    //         let user = data;
    //         response(context, { result:true, user});
    //     }
    //     // sql.close();
    //     // context.res = {
    //     //     status: 200,
    //     //     isRaw: true,
    //     //     body: result.recordsets[0],
    //     //     headers: {
    //     //         'Content-Type': 'application/json'
    //     //     }
    //     // };
    // } catch (err) {
    //     context.log(err.message);
    // }
};
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