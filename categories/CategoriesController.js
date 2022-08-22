const express = require("express");
const router = express.Router();
const Category = require("./Category");
const User = require("../user/User");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

// Cadastro registros de categorias
router.get("/admin/categories/new", adminAuth, (req, res) => {
   res.render("admin/categories/new");
});

// Listagem registros de categorias
router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll({order:[['id', 'DESC']]}).then(categories => {
            res.render("admin/categories/index", {
                categories: categories
            });
    });
});

// Exexuta o cadastro de uma nova categoria
router.post("/categories/save", adminAuth, (req, res) => {
    var title = req.body.title;
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        });
    }else{
        res.redirect("/admin/categories/new");
    }
});

// Exexuta o botão de delete de uma categoria listada
router.post("/categories/delete", adminAuth, (req, res) => {
    var id = req.body.idDelete;
    if(id != undefined) {
        if(!isNaN(id)) {
            Category.destroy({
                where: {
                    id: id
                }
           }).then(() => {
            res.redirect("/admin/categories");
           });
        }else{
            res.redirect("/admin/categories");
        }
    }else{
        res.redirect("/");
    }
});

// Executa o botão de edição de uma categoria listada
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;

    if(isNaN(id)) {
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {
        if(category != undefined) {
            res.render("admin/categories/edit", {category: category});
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    });
});

// Atualiza as categorias atráves do botão atualizar
router.post("/categories/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title}, {
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/categories");
    });
});

module.exports = router;