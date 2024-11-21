const nodemailer = require('nodemailer');

// Créez un transporteur Nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp-mail.gmail.com",
    secureConnection: false,
    port: 587,
    tls: {
        ciphers: "SSLv3"
    },
    service: 'gmail', // ou un autre service de messagerie
    auth: {
        user: "anis.znina.pro@gmail.com", // Adresse e-mail de l'expéditeur
        pass: "mtju otuq dnpu jejr"  // Mot de passe de l'expéditeur
    }
});
// Fonction pour envoyer un e-mail
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: "anis.znina.pro@gmail.com",
        to,
        subject,
        text,
    };
    return transporter.sendMail(mailOptions);
};
