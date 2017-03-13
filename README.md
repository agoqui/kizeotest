# kizeodefi
Défi KIZEO réalisé par Agostinho QUINTELA le 13/03/2017

## Le projet
 Tout est en html et Javascript, j'ai utilisé:
 * JQuery : Pour tout les appels ajax
 * dataTable: Pour gérer le tableau
 * Bootstrap: Pour le CSS
 * moment.js: Pour formater la date au format long 

 ## La récupération de données
 Elle se fait via l'api de kizeo sous l'url : https://www.kizeoforms.com/rest/v3/
 * Récupération d'un token pour l'authentification que l'on transmet ensuite au diffrents appels http
 * Récupration de la liste des formulaire : https://www.kizeoforms.com/rest/v3/forms
 * Récupération du détail d'un formaulaire: https://www.kizeoforms.com/rest/v3/forms/{{id_du_formulaire}}