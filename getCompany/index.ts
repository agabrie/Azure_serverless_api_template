import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const company_id: number = (Number)(req.params.company_id);
    
    // const category_id:number = (Number) (req.params.category_id);
    // const querySpec = {
    //    text:
    //    `
    //    SELECT * FROM Companies
    //    INNER JOIN Categories
    //    ON companies.category_id = Categories.id
    //    WHERE companies.category_id = ${category_id}
    //    `,
    //    values:[category_id]
    // }

    let { Company, User } = await defineModels();
    
    try {
        console.log(Company.association)
        let user_include = Company.association.User;
        user_include.include = [User.association.Role];
        let include = [Company.association.Category, user_include];
        
        // if (category_id && category_id != 3) {
        //     include.where = {
        //         [Op.or]: [{ id: category_id }, {id: 3}]
        //     }
        // }
        // console.log(include);
        let company = await Company.model.findByPk(company_id,{include: include});
        // console.log('comapnies', companies);
        response(context, {result:true,company});
    
        // Create a pool of connections
        // const pool = new pg.Pool(config);

        // Get a new client connection from the pool
        // const client = await sql.connect(config);

        // Execute the query against the client
        // const result = await client.query(querySpec);

        // Release the connection
        // sql.close();

        // Return the query resuls back to the caller as JSON
        // context.res = {
        //     status: 200,
        //     isRaw: true,
        //     // body: result.recordsets[0],
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // };
    } catch (err) {
        // context.log(err.message);
        response(context, {result:false,err:err.message});
    }

};

export default httpTrigger;