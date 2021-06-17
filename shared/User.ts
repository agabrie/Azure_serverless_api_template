import { DataTypes } from 'sequelize'

const UserModel = {
  full_name: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
}

var User = { model: null, define: null, association: { Role: null }, name: 'User'};
const define = async (sequelizer)=>{
 
  User.model = await sequelizer.define('User', UserModel, {timestamps: false});
}
User.define = define;

export { User };
export default { User };



/*
var User = { model: null, define: null, associate: null };
class UserModel extends Model { }
const define = async (sequelizer)=>{
  // sequelize.sync();
  await UserModel.init(UserObject, {
    sequelize: sequelizer,
    modelName: 'user'
  });
  User.model = UserModel;
}
*/