import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');

const bcrypt = require('bcrypt');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    // let token: string = (req.query.token || (req.body && req.body.token));
    let user_id: string = (req.query.user_id || (req.params && req.params.user_id));

    // let password: string = (req.query.password || (req.body && req.body.password));

//    const querySpec = {
//        text:
//         `
//         IF (NOT EXISTS(SELECT * FROM users WHERE token='${token}'))
//             BEGIN
//                 SELECT 'INVALID AUTHORIZATION TOKEN' AS error_message
//             END
//         ELSE
//             BEGIN
//                 SELECT TOP 1 * FROM users WHERE id='${user_id}'
//             END
//         `
//     }
    // context.log(querySpec.text);
    try {
        // console.log(req);
        let { User } = await defineModels();
        let user = await User.model.findByPk(user_id,{attributes: {exclude: ['password','token']}, include: [User.association.Role, User.association.Company,User.association.Category] });
        // console.log('user', user_id, user);
        response(context, {reponse:true,user})
        // const client = await sql.connect(config);
        // const result = await client.query(querySpec.text);
        // const records = result.recordset;
        // if (records.length < 1) {
            // response(context, { error: 'invalid username/email' });
        // }
        // else {
            // const user = records[0];
            // let validation = await validatePassword(password, user.password);
            // delete user.password;
            // context.log(validation);
            // context.log(result);
            // response(context,{ user, validation });
        // }
        
    } catch (err) {
        if (err.message.includes('Violation of UNIQUE KEY constraint'))
            response(context, {error: err.message,result: 'Username or email already taken.'})
    }
};

let validatePassword = async (password, dbpassword) => {
    return await bcrypt.compare(password, dbpassword).then(res => {
        // context.log(hash);
        return res;
    });
}

export default httpTrigger;