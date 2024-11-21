const nodemailerRouter = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { sendEmail } = require('../public/js/mailer.js'); // Importez votre fonction d'envoi d'e-mail

nodemailerRouter.post('/assign', async (req, res) => {
    const { ordinateur, employeId } = req.body;

    try {

        const assignOrdinateur = await prisma.assign.create({
            data: {
                ordinateur,
                employeId,
            },
        });

        // Récupérez l'e-mail de l'employé (supposons que vous ayez un modèle Employee)
        const employe = await prisma.employe.findUnique({
            where: { id: employeId },
        });

        // Envoyer une notification par e-mail à l'employé
        const subject = 'Assignation d\'ordinateur';
        const text = `Bonjour ${employe.firstName},\n\nVous avez été assigné à l'ordinateur avec l'ID ${ordinateur}.\n\nMerci,\nL'équipe RH.`;
        await sendEmail(employe.email, subject, text);

        res.json({ message: 'Ordinateur assigné et notification envoyée.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'assignation de l\'ordinateur' });
    }
});

module.exports = nodemailerRouter;