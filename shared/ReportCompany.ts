import { DataTypes } from 'sequelize'

const ReportCompanyModel = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true // Automatically gets converted to SERIAL for postgres
  }
}
var ReportCompany = { model: null, define: null, association: {}, name:'ReportCompany'};
const define = async (sequelizer)=>{
	ReportCompany.model = await sequelizer.define('ReportCompany', ReportCompanyModel, {timestamps: false});
}
ReportCompany.define = define;

export { ReportCompany };
export default { ReportCompany };