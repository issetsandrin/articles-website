const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const User = require("../user/User");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth")

// Tela de listagem de todos os artigos
router.get("/admin/articles", adminAuth,  (req, res) => {
    Article.findAll({include:[{model:Category, required: true}], order:[['id', 'DESC']]}).then(articles => {
        res.render("admin/articles/index", {
            articles: articles
        });
    });
});

// Tela de registros de artigos
router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories});
    });
});

// Função para cadastrar um artigo
router.post("/articles/save", adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

// Exexuta o botão de delete de um artigo listado
router.post("/articles/delete", adminAuth, (req, res) => {
    var id = req.body.idDelete;
    if(id != undefined) {
        if(!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
           }).then(() => {
            res.redirect("/admin/articles");
           });
        }else{
            res.redirect("/admin/articles");
        }
    }else{ 
        res.redirect("/"); 
    }
});

// Executa o botão de edição de uma categoria listada
router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;

    if(isNaN(id)) {
        res.redirect("/admin/articles");
    }

    Article.findByPk(id).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article: article, categories: categories });
            });
        }else{
            res.redirect("/admin/articles");
        }
    }).catch(erro => {
        res.redirect("/admin/articles");
    });
});


// Atualiza as categorias atráves do botão atualizar
router.post("/articles/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;

    Article.update({title: title, body: body, categoryId: category, slug:slugify(title)}, {
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

// Criando paginação nos artigos
router.get("/article/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;
    var maxPage = 5

    if(isNaN(page) || page == 1) {
        offset = 0;
    }else{
        offset = (parseInt(page) -1) * maxPage;
    }

    Article.findAndCountAll({
        limit: maxPage,
        offset: offset,
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {
        var next;
       
        if(offset + maxPage >= articles.count) {
            next = false;
        }else{
            next = true;
        }

        var result = {
            next: next,
            page: parseInt(page),
            articles: articles
        }
        
        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        });
    });
});

module.exports = router;