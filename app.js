const express = require("express")
const entrepriseRouter = require("./router/entrepriseRouter")
const ordinateurRouter = require("./router/ordinateurRouter")
const employeRouter = require("./router/employeRouter")

const session = require("express-session")

const app = express()
// appeller avant le middleware userRouter
app.use(express.static("./public"))
app.use(session({
    secret: "PrisonBreakDance.",
    resave: true,
    saveUninitialized: true,
}))

app.post('/itineraire', (req, res) => {
    const { depart, arrivee } = req.body;
    if (!depart || !arrivee) {
        return res.status(400).json({ error: 'Les adresses de départ et d\'arrivée sont requises.' });
    }
    // Logique pour calculer l'itinéraire ici (si nécessaire) ou passer les données à l'API front
    res.json({ message: 'Itinéraire calculé avec succès.' });
});

app.use(express.urlencoded({ extended: true }))

// Middleware pour analyser les données JSON
app.use(entrepriseRouter)
app.use(ordinateurRouter)
app.use(employeRouter)

app.listen(3004, () => {
    console.log("Connecté sur le port 3004");
})  