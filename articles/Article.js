const Sequelize = require("sequelize");
const connection = require("../database/config");

// Importanto o Modulo de Category
const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Article.belongsTo(Category); // Criando um relacionamento 1-P-1 com a Category
Category.hasMany(Article); // Criando um relacionamento 1-P-M com a Category

Article.sync({force: false}).then(() => {});
module.exports = Article;