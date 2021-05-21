import { Sequelize, DataTypes, Model  } from 'sequelize'

const getConfig = () => {
	const config = {
        server: (String)(process.env["dbhost"]),
        user: (String)(process.env["dbuser"]),
        password: (String)(process.env["dbpassword"]),
        database: (String)(process.env["dbname"]),
        port: (Number)(process.env["dbport"]),
        options: {
            encrypt: (Boolean) (process.env["dbencrypt"]),
            trustServerCertificate: true // change to true for local dev / self-signed certs
        }
	};
	return config;
}
const hello = () => {
	console.log('hello')
}
const getSequelize = () => {
	const config = getConfig();
	return new Sequelize(config.database, config.user, config.password, { host: config.server, dialect: 'mssql' });
}
export { hello,getConfig,getSequelize };
export default { hello, getConfig,getSequelize};