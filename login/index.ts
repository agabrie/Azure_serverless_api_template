import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');
const bcrypt = require('bcryptjs');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    let user_login: string = (req.query.user_login || (req.body && req.body.user_login));

    let password: string = (req.query.password || (req.body && req.body.password));
    console.log(user_login);
    
    let { User } = await defineModels();
    try{
        let user = await User.model.findOne({
            where: {
                [Op.or]: [
                    { username: user_login },
                    { email: user_login }
                ]
            }
        });

        if (!user) {
            response(context, { validation:false,message: 'Invalid username/email' });
        }
        else {
            let validation = await validatePassword(password, user.password);
            if (validation) {
                delete user.password;
                response(context, { validation, user });
            } else {
                response(context, { validation, message:'Password is incorrect' })
            }
        }
        
    } catch (err) {
            response(context, { result:false,err: err.message})
    }
};

let validatePassword = async (password, dbpassword) => {
    if (!password || password == '') { return false}
    return await bcrypt.compare(password, dbpassword).then(res => { return res });
}

export default httpTrigger;