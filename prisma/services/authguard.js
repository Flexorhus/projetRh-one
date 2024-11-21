const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const authguard = async (req, res, next) => {
    try {
        if (req.session.entreprise) {
            let entreprise = await prisma.entreprise.findUnique({
                where: {
                    email: req.session.entreprise.email
                }
            })
            if (entreprise) {
                return next()
            }
            throw { authguard: " Utilisateur non connecté" }
        }
        throw { authguard: " Utilisateur non connecté" }
    } catch (error) {
        res.redirect("/login")
    }
}

module.exports = authguard     