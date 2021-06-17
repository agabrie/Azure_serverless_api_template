import { DataTypes } from 'sequelize'

const CategoryModel = {
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}
var Category = { model: null, define: null, association: {}, name:'Category'};
const define = async (sequelizer)=>{
  Category.model = await sequelizer.define('Category', CategoryModel, {timestamps: false});
}
Category.define = define;

export { Category };
export default { Category };