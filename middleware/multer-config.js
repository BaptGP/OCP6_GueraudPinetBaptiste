// On importe multer qui est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

// On crée un dictionnaire des types MIME pour définire le format des images
// Donc la creation d'un objet pour ajouter une extention en fonction du type mime du ficher
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // On crée un objet de configuration pour préciser à multer où enregistrer les fichiers images et les renommer
  destination: (req, file, callback) => { // On mets la destination d'enregistrement des images
    callback(null, 'images'); // On passe le dossier images qu'on a créé dans le backend
  },
  filename: (req, file, callback) => { // On dit à multer quel nom de fichier on utilise pour éviter les doublons
    const name = file.originalname.split(' ').join('_');  // On génère un nouveau nom avec le nom d'origine, on supprime les espaces et on insère des underscores à la place
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);  // On appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur et on crée le filename en entier
  }
});

// On export le module, on lui passe l'objet storage, la méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({storage: storage}).single('image');