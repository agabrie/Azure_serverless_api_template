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

   const querySpec = {
       text:
       `
        IF (NOT EXISTS (SELECT * FROM sys.tables WHERE name='categories'))
            BEGIN
                CREATE TABLE categories(
	                id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	                type VARCHAR(32) NOT NULL
                );
            END;
        
        IF (not exists (select * from sys.tables where name='roles'))
            BEGIN
                CREATE TABLE roles(
                    id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
                    role_name VARCHAR(32)
                );
            END;
        
        if (not exists (select * from sys.tables where name='users'))
            BEGIN   
                CREATE TABLE users(
                    id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
                    first_name VARCHAR(64),
                    last_name VARCHAR(64),
                    username VARCHAR(64) NOT NULL UNIQUE,
                    email VARCHAR(128) NOT NULL UNIQUE,
                    password VARCHAR(64) NOT NULL,
                    role_id int,
                    CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(id)
                );
            END;
        
        if (not exists (select * from sys.tables where name='companies'))
            BEGIN
                CREATE TABLE companies(
                    id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
                    name VARCHAR(64) NOT NULL,
                    category_id int,
                    user_id int,
                    CONSTRAINT fk_category FOREIGN KEY(category_id) REFERENCES Categories(id),
                    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES Users(id)
                );
            END;

        IF(NOT EXISTS(SELECT 1 FROM categories))
            BEGIN
                INSERT INTO Categories(type) VALUES ('Growers');
                INSERT INTO Categories(type) VALUES ('Retailers');
                INSERT INTO Categories(type) VALUES ('Back-end Office');
            END;
        
        IF(NOT EXISTS(SELECT 1 FROM roles))
            BEGIN
                INSERT INTO roles(role_name) VALUES ('General Management');
                INSERT INTO roles(role_name) VALUES ('Operator');
                INSERT INTO roles(role_name) VALUES('Executive');
            END;
        `        
    }

    try {
        // Create a pool of connections
        // const pool = new pg.Pool(config);

        // Get a new client connection from the pool
        const client = await sql.connect(config);

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