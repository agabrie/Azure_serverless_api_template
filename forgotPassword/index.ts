import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');
const bcrypt = require('bcrypt');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    let user_login: string = (req.query.user_login || (req.body && req.body.user_login));

    // let password: string = (req.query.password || (req.body && req.body.password));
    console.log(req.body);
    
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
            let message = `${user.username}, Click this link to reset your password : http://192.168.8.117:8081/forgotPassword?user=${user.id}&token=${user.token}`;

            console.log("message",message)
            // let validation = await validatePassword(password, user.password);
            // if (validation) {
            //     delete user.password;
                response(context, { message });
            // } else {
                // response(context, { validation, message:'Password is incorrect' })
            // }
        }
        
    } catch (err) {
            response(context, { result:false,err: err.message})
    }
};

let validatePassword = async (password, dbpassword) => {
    return await bcrypt.compare(password, dbpassword).then(res => { return res });
}

export default httpTrigger;