# kizeodefi
Défi KIZEO réalisé par Agostinho QUINTELA le 13/03/2017

## installation
* `git clone https://github.com/agoqui/kizeotest.git`
* Puis lancer la page kizeo.html

## Fonctionnement
###Connection
Pour accéder aux données, l'utilisateur doit d'abord se connecter avec:
* Un nom d'utilisateur
* Un mot de passe
* Une société

Les 3 champs sont obligatoires.
Si la connection echoue, un message d'erreur est alors affiché.

### Affichage de la liste des formulaires
Une fois connecté, la liste des formulaires s'affichent dans un tableau. Celle-ci est triée par défaut sur la rubrique et le nom.
La date est affichée sous un format long (ex: Lundi 13 mars 2017 à 19:54:56)

### Affichage de l'ensemble des données d'un formulaire
Sur le clic du détail d'un formulaire, une fenêtre modale s'ouvre pour afficher l'ensemble des données de ce formulaire.

## Le projet
 Le projet est écris en html et Javascript. 
 J'ai utilisé les librairies suivantes:
 * JQuery : Pour tous les appels ajax
 * dataTable: Pour gérer la liste des formulaire dans un tableau
 * Bootstrap: Pour mettre en forme la page html
 * moment.js: Pour formater les dates dans un format long

 ## Les différentes requêtes appelées
 Les différentes données sont récupérées via le Web Service KIZEO.
 * Récupération du token pour l'authentification: https://www.kizeoforms.com/rest/v3/login: Ce token est transmis ensuite aux autres requêtes dans l'entête http.
 * Récupration de la liste des formulaire : https://www.kizeoforms.com/rest/v3/forms
 * Récupération des données saisies pour un formUlaire: 
 On récupère d'abord la liste des données du formulaire: https://www.kizeoforms.com/rest/v3/forms{{id_du_formulaire}}/data
Puis on récupère les données du formulaire: https://www.kizeoforms.com/rest/v3/forms{{id_du_formulaire}}/data/{{data_id}}
