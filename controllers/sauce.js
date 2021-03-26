const Sauce = require('../models/Sauce'); // Récupération du modèle 'sauce'
const fs = require('fs'); // Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images

// Permet de créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);  // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
    delete sauceObjet._id; // On supprime l'id généré automatiquement et envoyé par le front-end.
    const sauce = new Sauce({ // Création d'une instance du modèle Sauce
      ...sauceObjet,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // On modifie l'URL de l'image, on veut l'URL complète,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
    sauce.save() // Sauvegarde de la sauce dans la base de données
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'})) // On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
      .catch(error => res.status(400).json({ error })); // On ajoute un code erreur en cas de problème
  };

exports.modifySauce = (req, res, next) => { // Permet de modifier une sauce
    const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };



exports.likeDislike = (req, res, next) => {
    const like = req.body.like // Like présent dans le body
    const userId = req.body.userId // On prend le userID
    const sauceId = req.params.id // On prend l'id de la sauce
  
    if (like === 1) { // Si il s'agit d'un like
      Sauce.updateOne({
          _id: sauceId
        }, {
          $push: { // On push l'utilisateur et on incrémente le compteur de 1
            usersLiked: userId
          },
          $inc: {
            likes: +1
          }, 
        })
        .then(() => res.status(200).json({
          message: 'j\'aime ajouté !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
    }
    if (like === -1) {
      Sauce.updateOne( // S'il s'agit d'un dislike
          {
            _id: sauceId
          }, {
            $push: {
              usersDisliked: userId
            },
            $inc: {
              dislikes: +1
            }, 
          }
        )
        .then(() => {
          res.status(200).json({
            message: 'Dislike ajouté !'
          })
        })
        .catch((error) => res.status(400).json({
          error
        }))
    }
    if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
      Sauce.findOne({
          _id: sauceId
        })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersLiked: userId
                },
                $inc: {
                  likes: -1
                }, // On incrémente de -1
              })
              .then(() => res.status(200).json({
                message: 'Like retiré !'
              }))
              .catch((error) => res.status(400).json({
                error
              }))
          }
          if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersDisliked: userId
                },
                $inc: {
                  dislikes: -1
                },
              })
              .then(() => res.status(200).json({
                message: 'Dislike retiré !'
              }))
              .catch((error) => res.status(400).json({
                error
              }))
          }
        })
        .catch((error) => res.status(404).json({
          error
        }))
    }
  }