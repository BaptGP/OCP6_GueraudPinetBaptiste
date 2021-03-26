// Middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.

const jwt = require('jsonwebtoken'); // On récupère le package jsonwebtoken

// On vérifie le TOKEN de l'utilisateur, s'il correspond à l'id de l'utilisateur dans la requête, il sera autorisé à changer les données correspondantes.

module.exports = (req, res, next) => { // Ce middleware sera appliqué à toutes les routes afin de les sécuriser
  try {
    const token = req.headers.authorization.split(' ')[1];   // On récupère le token dans le header de la requête autorisation
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');  // On vérifie le token décodé avec la clé secrète initiéé avec la création du token encodé
    const userId = decodedToken.userId; // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'; // si le token ne correspond pas au userId : erreur
    } else {
      next(); // si tout est valide on passe au prochain middleware
    }
  } catch {
    res.status(401).json({ // probleme d'autentification si erreur dans les inscrutions
      error: new Error('Invalid request!')
    });
  }
};