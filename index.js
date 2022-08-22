const express = require("express");
const session = require("express-session");
const app = express();
const port = 8081;
const bodyParser = require("body-parser");
const connection = require("./database/config");

// Importanto os modulos na aplicação principal
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

// Importando os controllers das pastas
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./user/UserController");

// Criando e setando tempo de 5 minutos para a sessão
app.use(session({
    secret: "q1w2e3r4t5",
    cookie: {
        maxAge: 300000
    }
}));

// EJS Configuração
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Bodyparser Configuração
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Conexão com o banco de dados
connection.authenticate().then(() => {
    console.log("Conexão feita com sucesso!");
}).catch((error) => {
    console.log(error);
});

// Pagina principal
app.get("/", (req, res) => {
    Article.findAll({order:[['id', 'DESC']], limit: 5}).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
});

// Acessar um artigo pela slug criada no banco de dados
app.get("/:slug", (req, res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
})

// Pesquisar uma categoria pelo SLUG 
app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        }, 
        include: [
            {model: Article}
        ]
    }).then((category) => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

// Buscando as rotas dos arquivos que foram importados 
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

// Inicializando o servidor
app.listen(port, () => {
    console.log(`O servidor esta rodando na porta ${port}`);
});