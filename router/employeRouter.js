const employeRouter = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const hashPasswordExtension = require("../prisma/services/extensions/hashPasswordExtension")
const authguard = require("../prisma/services/authguard");
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient().$extends(hashPasswordExtension)

employeRouter.get('/addEmploye', authguard, (req, res) => {
    res.render('pages/addEmploye.twig');
    entreprise = req.session.entreprise
});
// Ajouter un nouvel employé
employeRouter.post('/addEmploye', authguard, async (req, res) => {
    try {
        const employe = await prisma.employe.create({
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                password: req.body.password,
                age: parseInt(req.body.age),
                civilite: req.body.civilite,
                entrepriseId: req.session.entreprise.id
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);

        res.render("pages/addEmploye.twig", {
            entreprise: req.session.entreprise,
            error
        })
    }
})
// Page pour modifier un employé existant
employeRouter.get('/updateEmploye/:id', authguard, async (req, res) => {
    res.render('pages/addEmploye.twig', {
        entreprise: req.session.entreprise,
        employe: await prisma.employe.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
    });
});
// Modifier un employé
employeRouter.post('/updateEmploye/:id', authguard, async (req, res) => {
    try {
        const updateEmploye = await prisma.employe.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                age: parseInt(req.body.age),
                civilite: req.body.civilite
            }
        });
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});
// Supprimer un employé
employeRouter.get('/deleteEmploye/:id', authguard, async (req, res) => {
    try {
        const deleteEmploye = await prisma.employe.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.redirect("/");
    } catch (error) {
        res.redirect("/");
    }
});

employeRouter.get("/loginEmploye", (req, res) => {
    res.render("pages/loginEmploye.twig"
    )
})
employeRouter.get("/intranetEmploye/", (req, res) => {
    res.render("pages/map.twig", {
        employe: req.session.employe
    })
})
employeRouter.post("/loginEmploye", async (req, res) => {
    try {
        const employe = await prisma.employe.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (employe) {
            if (await bcrypt.compare(req.body.password, employe.password)) {
                req.session.employe = employe
                console.log(employe);
                res.redirect("/intranetEmploye")
            }
            else {

                throw { password: "Mot de passe incorrect" };
            }
        } else {
            throw { email: "Cet utilisateur n'existe pas " }
        }
    } catch (error) {
        console.log(error);
        res.render("pages/loginEmploye.twig", {
            error
        })
    }
})

module.exports = employeRouter