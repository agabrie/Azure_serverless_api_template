import { AzureFunction, Context, HttpRequest } from "@azure/functions"
// import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let user_id: number =req.query.user_id || (req.body && req.body.user_id) || null;
  
    try {
        const { User } = await defineModels();
        let user = await User.model.findByPk(user_id);
        await user.destroy();
        response(context, {result:true,message:'user successfully removed'});
        // Create a pool of connections
        // const pool = new pg.Pool(config);

        // Get a new client connection from the pool
        // const client = await sql.connect(config);

        // Execute the query against the client
        // const result = await client.query(querySpec.text);

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
        response(context, {
					result: true,
					message: "removal of user was unsuccessful",
				});

        // context.log(err.message);
    }

};

export default httpTrigger;