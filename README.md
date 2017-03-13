# kizeodefi
Défi KIZEO réalisé par Agostinho QUINTELA le 13/03/2017

## installation
`git clone https://github.com/agoqui/kizeotest.git`
Puis lancer la page kizeo.html

## Le projet
 Le projet est en html et Javascript. J'ai utilisé:
 * JQuery : Pour tout les appels ajax
 * dataTable: Pour gérer le tableau
 * Bootstrap: Pour le CSS
 * moment.js: Pour formater la date au format long 

 ## La récupération de données
 Elle se fait via l'api de kizeo sous l'url : https://www.kizeoforms.com/rest/v3/
 * Récupération d'un token pour l'authentification que l'on transmet ensuite au diffrents appels http
 * Récupration de la liste des formulaire : https://www.kizeoforms.com/rest/v3/forms
 * Récupération du détail d'un formaulaire: https://www.kizeoforms.com/rest/v3/forms/{{id_du_formulaire}}

 ## Affichage des données
 Les données s'affiche dans un tableau géré par l'api dataTable.js permettant la gestion des tri et recherche sur le tableau.
 Une fenêtre modale s'affiche lors du clic sur le détail d'une ligne du tableau.