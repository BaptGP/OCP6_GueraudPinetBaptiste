const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');

router.post('/signup', verifyPassword, userCtrl.signup); // Chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base dedonnées
router.post('/login', userCtrl.login); // Vérifie les informations d'identification de l'utilisateur, enrenvoyant l'identifiant userID depuis la base de données

module.exports = router;