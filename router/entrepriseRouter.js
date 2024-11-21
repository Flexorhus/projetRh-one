const entrepriseRouter = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const hashPasswordExtension = require("../prisma/services/extensions/hashPasswordExtension")
const bcrypt = require('bcryptjs')
const authguard = require("../prisma/services/authguard")
const prisma = new PrismaClient().$extends(hashPasswordExtension)

entrepriseRouter.get('/', authguard, async (req, res) => {
    try {
        const entrepriseId = req.session.entreprise.id
        const employes = await prisma.employe.findMany({
            where: {
                entrepriseId
            },
            include: {
                entreprise: true,
                ordinateur: true
            }
        });
        const ordinateurs = await prisma.ordinateur.findMany({
            where: {
                entrepriseId
            },
            include: {
                entreprise: true,
                employe: true
            }
        });
        res.render('pages/home.twig', {
            ordinateurs,
            employes,
            entreprise: req.session.entreprise
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});
entrepriseRouter.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/login")
})
entrepriseRouter.get("/login", (req, res) => {
    res.render("pages/login.twig")
})
entrepriseRouter.post("/login", async (req, res) => {
    try {
        const entreprise = await prisma.entreprise.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (entreprise) {
            if (await bcrypt.compare(req.body.password, entreprise.password)) {
                req.session.entreprise = entreprise
                res.redirect("/")
            }
            else {
                console.log(entreprise);
                throw { password: "Mot de passe incorrect" };
            }
        } else {
            throw { email: "Cet utilisateur n'existe pas " }
        }
    } catch (error) {
        console.log(error);
        res.render("pages/login.twig", {
            error
        })
    }
})
entrepriseRouter.get("/register", (req, res) => {
    res.render("pages/register.twig")
})
entrepriseRouter.post("/register", async (req, res) => {
    try {
        if (req.body.password === req.body.confirmPassword) {
            const entreprise = await prisma.entreprise.create({
                data: {
                    siret: req.body.siret,
                    raisonSociale: req.body.raisonSociale,
                    email: req.body.email,
                    password: req.body.password,
                }
            })
            res.redirect("/login")
        } else throw ({ confirmPassword: "Votre mdp ne correspond pas" })
    } catch (error) {
        console.log(error);

        res.render("pages/register.twig", {
            error: error,
            title: "inscription"
        })
    }
})
module.exports = entrepriseRouter 
