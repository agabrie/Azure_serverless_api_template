import { AzureFunction, Context, HttpRequest } from "@azure/functions"
// import axios from "axios";
import { Op } from 'sequelize';
var { defineModels, response } = require('../shared/Models');
 const request = require('request');
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    // let report_id: string = (req.query.report_id || (req.params && req.params.report_id));
    
    let clientId = (String)(process.env["pbi-client-id"]);
    let secret = (String)(process.env["pbi-secret"]);
    let username = (String)(process.env["pbi-username"]);
    let password= (String)(process.env["pbi-password"]);

    try {
        let formData = {
                resource      : 'https://analysis.windows.net/powerbi/api',
                client_id     : clientId,
                client_secret : secret,
                grant_type    : 'password',
                username      : username,
                password      : password,
                scope         : 'openid',
        }
        let url = 'https://login.windows.net/0bb35620-bea9-4fc9-878f-8eb7245a857e/oauth2/token';
            // console.log(params)
        let headers = {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded"
        };
        // let access_token = await axios.post(url, formData, { headers, params: formData });
        let token = await request.post(
            {
                url: url,
                form: formData,
                headers: headers
            }
            ,
            async (err, result, body) => {
                // access_token = result;
                console.log(result.body);
                let jsonResponse = JSON.parse(result);
                console.log(jsonResponse.body.access_token);
                // return await JSON.parse(result);
            }
        )
        // console.log(access_token)
        // response(context, {result:true, access_token});
    } catch (err) {
        console.log(err)
        response(context, {result:false,err:err.message, error:err});
    }

};

export default httpTrigger;