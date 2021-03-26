const express = require('express'); // Importation d'express => Framework basé sur node.js
const bodyParser = require('body-parser'); // Pour gérer la demande POST provenant de l'application front-end, nous devrons être capables d'extraire l'objet JSON de la demande, on importe donc body-parser
const mongoose = require('mongoose'); // Plugin Mongoose pour se connecter à la data base Mongo Db
const path =require('path'); // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const session = require('cookie-session');

const sauceRoutes = require('./routes/sauce'); // On importe la route dédiée aux sauces
const userRoutes = require('./routes/user'); // On importe la route dédiée aux utilisateurs

// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require('dotenv').config();

mongoose.connect(process.env.DB_URL, 
{   useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); // Création d'une application express

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // on indique les méthodes autorisées pour les requêtes HTTP
    next();
  });


// Options pour sécuriser les cookies
const expiryDate = new Date(Date.now() + 3600000); // 1 heure (60 * 60 * 1000)
app.use(session({
  name: 'session',
  secret: process.env.SEC_SES,
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
}));

app.use(bodyParser.json()); // Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable

app.use('/images', express.static(path.join(__dirname, 'images'))); // Midleware qui permet de charger les fichiers qui sont dans le repertoire images


app.use('/api/sauces', sauceRoutes); // Va servir les routes dédiées aux sauces
app.use('/api/auth', userRoutes); // Va servir les routes dédiées aux utilisateurs
  
// Export de l'application express pour déclaration dans server.js 
module.exports = app;