import { AzureFunction, Context, HttpRequest } from "@azure/functions"
// import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let company_id: number =
			req.query.company_id || (req.body && req.body.company_id) || null;
  
    try {
        const { Company,Contact } = await defineModels();
        let company = await Company.model.findByPk(company_id);
        let contacts = await Contact.model.findAll({ where: {companyId:company_id}});
        // console.log(contacts)
        contacts.forEach(contact => {
            contact.destroy();
        });
        await company.destroy();
        response(context, {result:true,message:'Company successfully removed'});
        
    } catch (err) {
        response(context, {
					result: true,
					message: "removal of company was unsuccessful",
				});

        // context.log(err.message);
    }

};

export default httpTrigger;