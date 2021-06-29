

var { Role } = require("./Role.js");
var { User } = require("./User.js");
var { Category } = require("./Category.js");
var { Company } = require("./Company.js");
var { Report } = require("./Report.js");
var { Contact } = require("./Contact.js");
var { ReportRole } = require("./ReportRole.js");
var { ReportCompany } = require("./ReportCompany.js");

var { getSequelize } = require('../shared/config.js');
// const sequelize = getSequelize();

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
const manyToMany = async (modelA, modelB, pivot, foreignKeyNameA,foreignKeyNameB) => {
	await oneToMany(pivot, modelB, `${foreignKeyNameB}Id`, foreignKeyNameB);
	await oneToMany(pivot, modelA, `${foreignKeyNameA}Id`, foreignKeyNameA);
	modelA.association[modelB.name] = await belongsToMany(modelA,modelB, pivot,`${foreignKeyNameA}Id`, foreignKeyNameA);
	modelB.association[modelA.name] = await belongsToMany(modelB,modelA, pivot,`${foreignKeyNameB}Id`, foreignKeyNameB);
}
const oneToMany = async (modelA, modelB, foreignKeyID, foreignKeyName) => {
	modelA.association[modelB.name] = await belongsTo(modelA,modelB, foreignKeyID, foreignKeyName);
	modelB.association[modelA.name] = await hasMany(modelB, modelA, foreignKeyID, foreignKeyName);
	// console.log(modelA,modelB)
}
function getAllExcluded(arrayA, arrayB, value) {
	let excluded = arrayA.filter((a) => !arrayB.some((b) => a[value] == b[value]));
	return excluded;
}

function getAllNew(arrayA, arrayB, value){
	let nu = arrayB.filter((b) => !arrayA.some((a) => b[value] == a[value]));
	return nu;
}

async function updateAssociationArray(oldArray, newArray, fdelete, fnew) {
	// let nu = , toDelete = [];
	if (!oldArray) {
		oldArray = []
	}
	if (!newArray) {
		newArray = []
	}
	let nu = getAllNew(oldArray, newArray, 'id')
	let toDelete = getAllExcluded(oldArray, newArray, 'id')
	console.log("old",oldArray)
	console.log("updated",newArray);
	console.log("new",nu);
	console.log("to Delete",toDelete);
	for await (const contents of toDelete.map(async elem => await fdelete(elem))) {
		// console.log(contents)
	}
	await nu.forEach(async elem => {
		await fnew(elem);
	});
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
	await ReportRole.define(sequelizer);
	await ReportCompany.define(sequelizer);

	/* Company <- m to 1 -> Category */
	await oneToMany(Company, Category, 'categoryId', 'category');
	await oneToMany(User, Category, 'categoryId', 'category');
	await oneToMany(User, Role, 'roleId', 'role');
	await manyToMany(Company,User, Contact, 'company', 'user');
	await manyToMany(Report, Role, ReportRole, 'report', 'role');
	await manyToMany(Report, Company, ReportCompany, 'report', 'company');
	await oneToMany(Report, Category, "categoryId", "category");
	
	// console.log(Company.association, Category.association)
	// Company.association.Category = await belongsTo(Company,Category, 'categoryId', 'category');
	// Category.association.Company = await hasMany(Category, Company, 'categoryId', 'category');
	
	/* User <- m to 1 -> Category */
	
		// User.association.Category = await belongsTo(User, Category, 'categoryId', 'category');
		// Category.association.User = await hasMany(Category, User, 'categoryId', 'category');
	
	
	/* User <- m to 1 -> Role */
	
		// User.association.Role = await belongsTo(User, Role, 'roleId', 'role');
		// Role.association.User = await hasMany(Role, User, 'roleId', 'role');
	

	/* Role <- 1 to m -> Report <- m to 1 -> Company */
	/* Role <- m to 1 -> Report */
	/*
		ReportRole.association.Role = await belongsTo(ReportRole, Role, 'roleId', 'role');
		Role.association.ReportRole = await hasMany(Role, ReportRole, 'roleId', 'role');
	* /

	ReportRole.association.Report = await belongsTo(ReportRole, Report, 'reportId', 'report');
	Report.association.ReportRole = await hasMany(Report, ReportRole, 'reportId', 'report');
	
	Report.association.Role = await belongsToMany(Report, Role, ReportRole, 'reportId', 'report');
	Role.association.Report = await belongsToMany(Role,Report,ReportRole,'roleId','role');
	// Report.association.Company = await belongsToMany(Report, Company, ReportCompany, 'reportId', 'report');
	// Company.association.Report = await belongsToMany(Company,Report,ReportCompany,'companyId','company');
	
	
	// Report.association.Company = await belongsTo(Report, Company, 'companyId', 'company');
	// Company.association.Report = await hasMany(Company,Report,'companyId','company');
	
	// Company.association.Role = await belongsToMany(Company,Role, Report,'companyId','company');
	// Role.association.Company = await belongsToMany(Role, Company, Report, 'roleId', 'role');




	
	/* User <- 1 to m -> Contact <- m to 1 -> Company */
	
	/*
	Contact.association.User = await belongsTo(Contact, User, 'userId', 'user');
	User.association.Contact = await hasMany(User, Contact, 'userId', 'user');
	
	Contact.association.Company = await belongsTo(Contact, Company, 'companyId', 'company');
	Company.association.Contact = await hasMany(Company,Contact,'companyId','company');
	
	*/
	/*
	await oneToMany(Contact, User, 'userId', 'user');
	await oneToMany(Contact, Company, 'companyId', 'company');
	Company.association.User = await belongsToMany(Company,User, Contact,'companyId','company');
	User.association.Company = await belongsToMany(User,Company, Contact,'userId','user');
	*/
	// await manyToMany(Role,Report, ReportRole, 'role', 'report');
	// await manyToMany(Report,Company, ReportCompany, 'report', 'company');
	
	return { Role, User,Category,Company,Report,Contact, ReportRole, ReportCompany, sequelize:sequelizer };
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
export default {defineModels, response, updateAssociationArray}
export {defineModels,response, updateAssociationArray}