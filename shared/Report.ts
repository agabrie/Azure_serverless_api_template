import { DataTypes } from 'sequelize'

const ReportModel = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true
	},
	description: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true
  }
}
var Report = { model: null, define: null, association: {}};
const define = async (sequelizer)=>{
  Report.model = await sequelizer.define('Report', ReportModel, {timestamps: false});
}
Report.define = define;

export { Report };
export default { Report };