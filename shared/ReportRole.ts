import { DataTypes } from 'sequelize'

const ReportRoleModel = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true // Automatically gets converted to SERIAL for postgres
  }
}
var ReportRole = { model: null, define: null, association: {},name:'ReportRole'};
const define = async (sequelizer)=>{
	ReportRole.model = await sequelizer.define('ReportRole', ReportRoleModel, {timestamps: false});
}
ReportRole.define = define;

export { ReportRole };
export default { ReportRole };