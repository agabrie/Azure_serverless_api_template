import { DataTypes } from 'sequelize'

const ContactModel = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true // Automatically gets converted to SERIAL for postgres
  }
}
var Contact = { model: null, define: null, association: {}};
const define = async (sequelizer)=>{
	Contact.model = await sequelizer.define('Contact', ContactModel, {timestamps: false});
}
Contact.define = define;

export { Contact };
export default { Contact };