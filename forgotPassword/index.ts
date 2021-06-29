import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { encode } from "html-entities";
import { Op } from 'sequelize';
import { smtpMail } from "../shared/smtp";
var { defineModels, response } = require('../shared/Models');
const bcrypt = require('bcryptjs');

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
            response(context, { result:false,message: 'Invalid username/email' });
        }
        else {
            let url = String(process.env["app-url"]);

            // let message = `${user.username}, Click this link to reset your password : http://192.168.8.117:8081/forgotPassword?user=${user.id}&token=${user.token}`;
            smtpMail(
							user.email,
							"Password Reset Requested",
							`Good Day ${user.name}, click the button below to reset your password`,
							`${user.username},<br />
                Click <a href='${url}/resetPassword?user=${
								user.id
							}&token=${encode(
								user.token
							)}'> here </a> to reset your password. <br />
                Or click this link <br />
                ${url}/resetPassword?user=${user.id}&token=${encode(
								user.token
							)}`
						);
            // console.log("message",message)
            // let validation = await validatePassword(password, user.password);
            // if (validation) {
            //     delete user.password;
                response(context, {result:true, message:'email sent with instructions to reset password' });
            // } else {
                // response(context, { validation, message:'Password is incorrect' })
            // }
        }
        
    } catch (err) {
            response(context, { result:false,message: err.message})
    }
};

let validatePassword = async (password, dbpassword) => {
    return await bcrypt.compare(password, dbpassword).then(res => { return res });
}

export default httpTrigger;