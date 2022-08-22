const express = require("express");
const router = express.Router();
const User = require("./User");
const bhash = require("bcryptjs")

router.get("/admin/login", (req, res) => {
    res.render("admin/users/login");  
});

// Batendo os dados para efetuar o login
router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        // Verificando email valido do usuário
        if(user != undefined){
            // Validando a senha do usuário
            var correct = bhash.compareSync(password, user.password);
            if(correct) {
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
                res.redirect("/admin/articles");
            }else{
                res.redirect("/admin/login");
            }
        }else{
            res.redirect("/admin/login");
        }
    });
});

// Deslogar do sistema zerando a sessão
router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

// Listagem de usuários em grid.
router.get("/admin/users", (req, res) => {
    User.findAll({order: [["id", "DESC"]]}).then(users => {
        res.render("admin/users/index", {users: users});
    });
});


// Tela de cadastro de usuários. 
router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

// Gerando hash para a senha e cadastrando no banco de dados o usuário.
router.post("/users/create", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var passw = req.body.password;

    User.findOne({where: {email: email}}).then( user => {
        if(user == undefined) {
            var salt = bhash.genSaltSync(10);
            var hash = bhash.hashSync(passw, salt);

            User.create({
                name: name,
                email: email,
                password: hash
            }).then(() => {
               res.redirect("/admin/users")
            }).catch(err => {
                res.redirect("/");
            });
        }else{
            res.redirect("/admin/users/create");
        }
    });
});

module.exports = router;