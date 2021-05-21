import { Sequelize, DataTypes, Model  } from 'sequelize'
var { getConfig, getSequelize }  = require('../shared/config.js');
const sequelize = getSequelize();

const Test = sequelize.define('Test', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
});
// sequelize.sync();
export { Test };
export default { Test };
