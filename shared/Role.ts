import { DataTypes } from 'sequelize'

const RoleModel = {
  role_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}
var Role = { model: null, define: null, association: {}};
const define = async (sequelizer)=>{
  Role.model = await sequelizer.define('Role', RoleModel, {timestamps: false});
}
Role.define = define;

export { Role };
export default { Role };