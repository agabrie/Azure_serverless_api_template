

var { Role } = require("./Role.js");
var { User } = require("./User.js");
var { Category } = require("./Category.js");
var { Company } = require("./Company.js");
var { Report } = require("./Report.js");
var { Contact } = require("./Contact.js");

var { getSequelize } = require('../shared/config.js');
const sequelize = getSequelize();

const belongsTo = async (a, b, foreignKeyID, foreignKeyName) => {
	await a.model.belongsTo(b.model, { as: foreignKeyName, foreignKey: foreignKeyID })
	let result = { model: b.model, as: foreignKeyName }
	return result;
}

const hasMany = async (a, b, foreignKeyID = null, foreignKeyName = null) => {
	await a.model.hasMany(b.model, { foreignKey: foreignKeyID })
	let result = { model: b.model, as: foreignKeyName }
	return result;
}
const belongsToMany = async (a, b, pivot, foreignKeyID, foreignKeyName) => {
	await a.model.belongsToMany(b.model, { through: pivot.model, foreignKey: foreignKeyID })
	let result = { model: b.model, through: { model: pivot.model } };
	// let result = { model: b.model, as: foreignKeyName }
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
	await Contact.define(sequelizer);

	/* Company <- m to 1 -> Category */
	Company.association.Category = await belongsTo(Company,Category, 'categoryId', 'category');
	Category.association.Company = await hasMany(Category, Company, 'categoryId', 'category');
	
	/* User <- m to 1 -> Category */
	User.association.Category = await belongsTo(User,Category, 'categoryId', 'category');
	Category.association.User = await hasMany(Category, User, 'categoryId', 'category');
	
	/* User <- m to 1 -> Role */
	User.association.Role = await belongsTo(User, Role, 'roleId', 'role');
	Role.association.User = await hasMany(Role, User, 'roleId', 'role');

	/* Role <- 1 to m -> Report <- m to 1 -> Company */
	Report.association.Role = await belongsTo(Report, Role, 'roleId', 'role');
	Role.association.Report = await hasMany(Role, Report, 'roleId', 'role');
	
	Report.association.Company = await belongsTo(Report, Company, 'companyId', 'company');
	Company.association.Report = await hasMany(Company,Report,'companyId','company');
	
	Company.association.Role = await belongsToMany(Company,Role, Report,'companyId','company');
	Role.association.Company = await belongsToMany(Role, Company, Report, 'roleId', 'role');
	
	/* User <- 1 to m -> Contact <- m to 1 -> Company */
	Contact.association.User = await belongsTo(Contact, User, 'userId', 'user');
	User.association.Contact = await hasMany(User, Contact, 'userId', 'user');
	
	Contact.association.Company = await belongsTo(Contact, Company, 'companyId', 'company');
	Company.association.Contact = await hasMany(Company,Contact,'companyId','company');

	Company.association.User = await belongsToMany(Company,User, Contact,'companyId','company');
	User.association.Company = await belongsToMany(User,Company, Contact,'userId','user');
	
	return { Role, User,Category,Company,Report,Contact, sequelize:sequelizer };
}

const response = async (context, data, code=200) => {
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