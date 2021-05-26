var { Role } = require("./Role.js");
var { User } = require("./User.js");
var { Category } = require("./Category.js");
var { Company } = require("./Company.js");
var { Report } = require("./Report.js");

var { getSequelize } = require('../shared/config.js');
const sequelize = getSequelize();

const belongsTo = async (a, b, foreignKeyID, foreignKeyName) => {
	let assoc = await a.model.belongsTo(b.model, { as: foreignKeyName, foreignKey: foreignKeyID })
	let result = { model: b.model, as: foreignKeyName }
	return result;
}

const hasMany = async (a, b, foreignKeyID = null, foreignKeyName = null) => {
	let assoc = await a.model.hasMany(b.model, { foreignKey: foreignKeyID })
	let result = { model: b.model, as: foreignKeyName }
	return result;
}
const belongsToMany = async (a, b, pivot,foreignKeyID,foreignKeyName) => {
	let assoc = await a.model.belongsToMany(b.model, { through: pivot.model,foreignKey:foreignKeyID })
	let result = { model: b.model, as: foreignKeyName }
	// console.log(assoc,result)
	return result;
}
const defineModels = async (sequelizer = null) => {
	if (sequelizer == null)
		sequelizer = await  getSequelize();
	
	await Role.define(sequelizer);
	await User.define(sequelizer);
	await Category.define(sequelizer);
	await Company.define(sequelizer);
	await Report.define(sequelizer);
	
	Company.association.Category = await belongsTo(Company,Category, 'categoryId', 'category');
	Category.association.Company = await hasMany(Category,Company, 'categoryId', 'category');

	User.association.Role = await belongsTo(User, Role, 'roleId', 'role');
	Role.association.User = await hasMany(Role, User, 'roleId', 'role');

	Role.association.Company = await belongsToMany(Role, Company, Report,'roleId','company');
	Company.association.Role = await belongsToMany(Company, Role, Report, 'companyId', 'role');

	// console.log(Role,Company);
	return { Role, User,Category,Company,Report, sequelize:sequelizer };
}

const response = async (context, data, code=200) => {
    // context.log(data);
    context.res = {
            status: code,
            isRaw: true,
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        };
}
export default {defineModels, response}
export {defineModels,response}