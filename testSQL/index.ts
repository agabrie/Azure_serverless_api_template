import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const sql = require('mssql')

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

    let q =
    `
    if not exists (select * from sys.tables where name='categories')
        CREATE TABLE categories(
	        id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	        type VARCHAR(32)
        );

    INSERT INTO Categories(type) VALUES ('Growers');
    INSERT INTO Categories(type) VALUES ('Retailers');
    INSERT INTO Categories(type) VALUES ('Back-end Office');
    `
    
    const querySpec = `SELECT * FROM Categories;`;
    
    try {
        let client = await sql.connect(config);
        const result =await client.query(q)
        context.log(result);
        sql.close();

        context.res = {
            status: 200,
            isRaw: true,
            body: result.recordsets[0],
            headers: {
                'Content-Type': 'application/json'
            }
        }
    } catch (err) {
        context.log(err.message);
    }
};

export default httpTrigger;