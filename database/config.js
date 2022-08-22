const Sequelize = require("sequelize");
const root = 'root'
const pswd = ''
const baseName = 'blogsite'

const connection = new Sequelize(baseName, root, pswd, {
    host: 'localhost', 
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;