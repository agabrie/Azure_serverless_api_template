import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Sequelize, DataTypes, Model  } from 'sequelize'
var { getSequelize }  = require('../shared/config.js');
var { Test }  = require('../shared/Test.js');
const sequelize = getSequelize();

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    console.log(Test === sequelize.models.Test);
    try {
        await sequelize.authenticate();
        await Test.create({firstName:'Aqeelah',lastName:'Nel'})
        console.log('Connection has been established successfully.');
    } catch (err) {
        context.log(err.message);
    }
};

export default httpTrigger;