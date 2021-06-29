import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');
const bcrypt = require('bcryptjs');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    let user_id: string = (req.query.user_id || (req.body && req.body.user_id));
    let user_token: string = (req.query.user_token || (req.body && req.body.user_token));

    let password: string = (req.query.password || (req.body && req.body.password));
    console.log(req.body);
    
    let { User } = await defineModels();
    try{
        let user = await User.model.findByPk(
            user_id
            // {
            // where: {
            //     [Op.or]: [
            //         { username: user_login },
            //         { email: user_login }
                // ]
            // }
        // }
        );

        if (!user) {
            response(context, { validation:false,message: 'Invalid username/email' });
        }
        else {
            // let message = `${user.username}, Click this link to reset your password : http://192.168.8.117:8081/forgotPassword?user=${user.id}&token=${user.token}`;

            // console.log(message)
            let validation = await validateToken(user_token, user.token);

            if (validation) {
                console.log('before',user.password)
                let hash:string = await bcrypt.hash(password, 12).then(hash => {return hash;});
                user.password = hash;
                await user.save();
                console.log('after', user.password)
                response(context, {result:true,message:"password successfully reset"})
            //     delete user.password;
                // response(context, { message });
            } else {
                response(context, { validation, message:'Token is incorrect' })
            }
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