const express = require('express');
const router = express.Router(); // Appel du routeur avec la méthode mise à disposition par Express

const sauceCtrl = require('../controllers/sauce'); // On importe le controller
const auth = require('../middleware/auth'); // On importe le middleware auth pour sécuriser les routes
const multer = require('../middleware/multer-config'); //On importe le middleware multer pour la gestion des images

router.post('/', auth, multer, sauceCtrl.createSauce); // Capture et enregistre l'image, analyse la sauce en utilisant une chaîne de caractères et l'enregistre dans la base de données
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Met à jour la sauce avec l'identifiant fourni
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Supprime la sauce avec l'ID fourni.
router.get('/:id', auth, sauceCtrl.getOneSauce); // Renvoie la sauce avec l'ID fourni
router.get('/', auth, sauceCtrl.getAllSauces); // Renvoie le tableau de toutes les sauces dans la base de données
router.post('/:id/like', auth, sauceCtrl.likeDislike); // Définit le statut "j'aime" pour userID fourni

module.exports = router;