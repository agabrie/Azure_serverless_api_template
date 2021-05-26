import { DataTypes } from 'sequelize'

const CompanyModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}
var Company = { model: null, define: null, association: {}};
const define = async (sequelizer)=>{
  Company.model = await sequelizer.define('Company', CompanyModel, {timestamps: false});
}
Company.define = define;

export { Company };
export default { Company };