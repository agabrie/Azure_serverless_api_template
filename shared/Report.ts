import { DataTypes } from 'sequelize'

const ReportModel = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true, // Automatically gets converted to SERIAL for postgres
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		// unique: true
	},
	reportId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	workspaceId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false,
		// unique: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: true,
		// unique: true
	},
};
var Report = { model: null, define: null, association: {}, name:'Report'};
const define = async (sequelizer)=>{
  Report.model = await sequelizer.define('Report', ReportModel, {timestamps: false});
}
Report.define = define;

export { Report };
export default { Report };