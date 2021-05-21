import { Sequelize, DataTypes, Model  } from 'sequelize'
var { Role }  = require('../shared/Role.js');

const UserModel = {
  // Model attributes are defined here
  first_name: {
    type: DataTypes.STRING,
    // allowNull: true
  },
  last_name: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  }
}
// const User = sequelize.define('User', UserModel, {/* Other model options go here*/ });
var User = {model:null,define:null};
const define = (sequelizer)=>{
  // sequelize.sync();
  User.model = sequelizer.define('User', UserModel, {});
  User.model.belongsTo(Role.model);
}

User.define = define;

export { User };
export default { User };
