import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const sql = require('mssql');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const config = {
        server: process.env["dbhost"],
        user: process.env["dbuser"],
        password: process.env["dbpassword"],
        database: process.env["dbname"],
        port: process.env["dbport"],
        encrypt:process.env["dbencrypt"]
    };

   const querySpec = {
       text:
       `
        if not exists (select * from sys.tables where name='categories')
        CREATE TABLE categories(
	        id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	        type VARCHAR(32) NOT NULL
        );
        
        if not exists (select * from sys.tables where name='roles')
        CREATE TABLE roles(
	        id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	        role_name VARCHAR(32)
        );
        
        if not exists (select * from sys.tables where name='users')
        CREATE users(
            id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
            name VARCHAR(64) NOT NULL,
            email VARCHAR(128) NOT NULL,
            role_id int,
            CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(id)
        );

        if not exists (select * from sys.tables where name='companies')
        CREATE TABLE companies(
            id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
            name VARCHAR(64) NOT NULL,
            category_id int,
            user_id int,
            CONSTRAINT fk_category FOREIGN KEY(category_id) REFERENCES Categories(id),
            CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES Users(id)
        );
        
        INSERT INTO Categories(type) VALUES ('Growers');
        INSERT INTO Categories(type) VALUES ('Retailers');
        INSERT INTO Categories(type) VALUES ('Back-end Office');

        INSERT INTO Roles(role_name) VALUES ('General Management');
        INSERT INTO Roles(role_name) VALUES ('Operator');
        INSERT INTO Roles(role_name) VALUES ('Executive');
        `
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