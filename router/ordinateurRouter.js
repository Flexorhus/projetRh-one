const ordinateurRouter = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const authguard = require("../prisma/services/authguard")
const nodemailer = require("nodemailer"); // Ajouter Nodemailer
const prisma = new PrismaClient()

// Configurer Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Fonction pour envoyer l'email de bienvenue
async function envoyerEmailBienvenue(employe, ordinateur) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employe.email,
        subject: `Bienvenue ${employe.firstname} !`,
        text: `Bonjour ${employe.firstName},\n\nVous avez été affecté à l'ordinateur ${ordinateur.name}. Veuillez vous connecter à votre espace intranet pour plus d'informations sur le séminaire.\n\nVos identifiants :\nEmail: ${employe.email}\n\nÀ bientôt,\nL'équipe RH.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email de bienvenue envoyé à " + employe.email);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
    }
}


ordinateurRouter.get("/addPc", authguard, async (req, res) => {
    const employesSansOrdinateur = await prisma.employe.findMany({
        where: {
            ordinateur: null,
            entrepriseId: req.session.entreprise.id
        }
    })
    res.render("pages/addPc.twig", {
        entreprise: req.session.entreprise,
        employesSansOrdinateur: employesSansOrdinateur
    })
})
ordinateurRouter.post("/addPc", authguard, async (req, res) => {
    try {
        const ordinateur = await prisma.ordinateur.create({
            data: {
                name: req.body.name,
                entrepriseId: req.session.entreprise.id,
                employeId: parseInt(req.body.employeId)
            }
        })
        // Récupérer les informations de l'employé assigné
        const employe = await prisma.employe.findUnique({
            where: { id: parseInt(req.body.employeId) }
        });
        // Envoyer l'e-mail de bienvenue
        await envoyerEmailBienvenue(employe, ordinateur);
        res.redirect("/")
    } catch (error) {
        const employesSansOrdinateur = await prisma.employe.findMany({
            where: {
                ordinateur: null,
                entrepriseId: req.session.entreprise.id
            }
        })
        res.render("pages/addPc.twig", {
            entreprise: req.session.entreprise,
            employesSansOrdinateur,
            error
        })
    }
})
ordinateurRouter.get("/updatePc/:id", authguard, async (req, res) => {
    try {
        const ordinateur = await prisma.ordinateur.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                employe: true
            }
        });
        const employesSansOrdinateur = await prisma.employe.findMany({
            where: {
                OR: [
                    {
                        ordinateur: null
                    },
                    {
                        id: ordinateur.employeId || undefined
                    }
                ],
                entrepriseId: req.session.entreprise.id
            }
        });
        res.render("pages/addPc.twig", {
            entreprise: req.session.entreprise,
            ordinateur,
            employesSansOrdinateur
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});
ordinateurRouter.post("/updatePc/:id", authguard, async (req, res) => {
    try {
        const updatepc = await prisma.ordinateur.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name: req.body.name,
                entrepriseId: req.session.entreprise.id,
                employeId: req.body.employeId ? parseInt(req.body.employeId) : null  // Mettre à jour l'employé
            }
        });
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});
ordinateurRouter.get("/deletePc/:id", authguard, async (req, res) => {
    try {
        const deletepc = await prisma.ordinateur.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect("/")
    } catch (error) {
        res.redirect("/")
    }
})
module.exports = ordinateurRouter 
