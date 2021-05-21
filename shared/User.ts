import { Sequelize, DataTypes, Model  } from 'sequelize'
var { getConfig, getSequelize }  = require('../shared/config.js');
const sequelize = getSequelize();

const User = sequelize.define('User', {
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
    allowNull: true
  },
}, {
  // Other model options go here
});
// sequelize.sync();
export { User };
export default { User };
