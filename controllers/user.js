const bcrypt = require('bcrypt'); // On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const jwt = require('jsonwebtoken'); // On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte

const User = require('../models/User'); // On récupère notre model User ,créer avec le schéma mongoose

exports.signup = (req, res, next) => { // On sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt
    bcrypt.hash(req.body.password, 10) // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
    .then(hash => {
        const user = new User({ // Création du nouvel utilisateur avec le model mongoose
            email: req.body.email,  // On passe l'email qu'on trouve dans le corps de la requête
            password: hash // On récupère le mdp hashé de bcrypt
        });
        user.save() // On enregistre l'utilisateur dans la base de données
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error })); // Si il existe déjà un utilisateur avec cette adresse email
    })
    .catch(error => res.status(500).json({ error }));
};

/* Le Middleware pour la connexion d'un utilisateur vérifie si l'utilisateur existe dans la base MongoDB lors du login
si oui il vérifie son mot de passe, s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, sinon il renvoie une erreur */

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // On doit trouver l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // Si on trouve pas l'utilisateur on va renvoyer un code 401 "non autorisé"
        }
        bcrypt.compare(req.body.password, user.password) // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
          .then(valid => {
            if (!valid) { // Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({  // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
              userId: user._id,
              token: jwt.sign(  // on va pouvoir obtenir un token encodé pour cette authentification grâce à jsonwebtoken
                  { userId: user._id }, // Encodage de l'userdID 
                  'RANDOM_TOKEN_SECRET', // Clé d'encodage du token
                  { expiresIn: '24h' }  // Argument de configuration avec une expiration au bout de 24h
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };