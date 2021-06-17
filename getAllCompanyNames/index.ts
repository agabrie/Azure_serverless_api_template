import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
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
    const category_id:number|string = req.params.category_id;
    console.log(category_id);
    let { Company } = await defineModels();
    
    try {
        let include = Company.association.Category;
        
        // if (category_id && category_id != 3) {
        //     include.where = {
        //         [Op.or]: [{ id: category_id }, {id: 3}]
        //     }
        // }
        // console.log(include);
        if (category_id && category_id != 'all') {
            // if (category_id != 3) {
                include.where = {
                    id: category_id
                    // [Op.or]: [{ id: category_id }, {id: 3}]
                }
            // }
        }
        let companies = await Company.model.findAll({
            // attributes: { exclude: ['users'] },
            
            include: include
        });
        // console.log('comapnies', companies);
        response(context, {result:true,companies});
    
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