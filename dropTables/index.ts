import { AzureFunction, Context, HttpRequest } from "@azure/functions"
var { defineModels,response } = require("../shared/Models");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        let { sequelize } = await defineModels();
        await sequelize.drop();
        await response(context, {success:'All tables dropped successfully'});
        
    } catch (err) {
        await response(context, {error:err.message});

    }

};

export default httpTrigger;