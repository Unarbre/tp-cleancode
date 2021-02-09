# Pour me lancer # 

`npm i`

`npm run start:dev`

## pour lancer les tests ##

`npm test`

PROBLEME D'IMPLEMENTATION DES TESTS A CAUSE DE MONGO ET DE L'INJECTION DE MODEL DANS LES SERVICES :( L'injection automatique est rendue impossible dans les fichiers de test et ... ca pète :s

Du coup, pas tester, my bad.

Désolé ~~

## Pour gagner du temps sur l'app ##

`J'ai mis dans le projet un environnement insomnia avec les requête CRUD dedans.`

La création de livre et de réservations est réservée au Librarian (utilisateur de type = 0);

Il suffit de passer l'id de l'utilisateur en token Bearer pour être authentifié en tant que tel.

Seul la route de création d'utilisateur n'a aucune contrainte de middleware. Pour les autres, il faut au pire être un utilisateur (compte de type 1 ou 2), au mieux être un admin (compte de type 0).