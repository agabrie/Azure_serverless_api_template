import { Sequelize, DataTypes, Model  } from 'sequelize'

const RoleModel = {
  role_name: {
    type: DataTypes.STRING,
    // allowNull: true
  }
}
// const User = sequelize.define('User', UserModel, {/* Other model options go here*/ });
var Role = {model:null,define:null};
const define = (sequelizer)=>{
  // sequelize.sync();
  Role.model = sequelizer.define('Role', RoleModel, {});
}

Role.define = define;

export { Role };
export default { Role };
