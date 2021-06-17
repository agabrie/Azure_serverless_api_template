import { DataTypes } from 'sequelize'

const CompanyModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contact_name: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false
  },
}
var Company = { model: null, define: null, association: {},name:'Company'};
const define = async (sequelizer)=>{
  Company.model = await sequelizer.define('Company', CompanyModel, {timestamps: false});
}
Company.define = define;

export { Company };
export default { Company };