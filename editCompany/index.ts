import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');
const bcrypt = require('bcryptjs');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    let company_id: string =
			req.query.company_id || (req.body && req.body.company_id);
    // let user_token: string = (req.query.user_token || (req.body && req.body.user_token));
    let name: string = req.query.name || (req.body && req.body.name);
    let contact_name: string =
			req.query.contact_name || (req.body && req.body.contact_name);
    let contact_email: string =
			req.query.contact_email || (req.body && req.body.contact_email);
    // let c: string = (req.query.password || (req.body && req.body.password));
    // let : string = (req.query.password || (req.body && req.body.password));
                        
    // name: company.name,
						// contact_name: company.contact_name,
						// contact_email: company.contact_email,
    // let password: string = (req.query.password || (req.body && req.body.password));
    console.log(req.body);
    
    let { Company } = await defineModels();
    try{
        let company = await Company.model.findByPk(
            company_id
            // {
            // where: {
            //     [Op.or]: [
            //         { username: user_login },
            //         { email: user_login }
                // ]
            // }
        // }
        );
        console.log(company)
        if (!company) {
            response(context, { result:false,message: 'Invalid Company_id' });
        }
        else {
            // let message = `${user.username}, Click this link to reset your password : http://192.168.8.117:8081/forgotPassword?user=${user.id}&token=${user.token}`;

            // console.log(message)
            // let validation = await validateToken(user_token, user.token);

            // if (validation) {
                // console.log('before',user.password)
                // let hash:string = await bcrypt.hash(password, 12).then(hash => {return hash;});
                // user.password = hash;
            company.name = name;
            company.contact_name = contact_name;
            company.contact_email = contact_email;
                await company.save();
                // console.log('after', user.password)
                response(context, {result:true,message:"updated Contact Details"})
            //     delete user.password;
                // response(context, { message });
            // } else {
                // response(context, { validation, message:'Token is incorrect' })
            // }
        }
        
    } catch (err) {
            response(context, { result:false,err: err.message})
    }
};

let validateToken = async (token, dbtoken) => {
    return token == dbtoken;
    // return await bcrypt.compare(token, dbtoken).then(res => { return res });
}

export default httpTrigger;