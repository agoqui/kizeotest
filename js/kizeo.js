const _URL = 'https://www.kizeoforms.com/rest/v3/'; // URL du webService

$(document).ready(function() {
	$( "#detailForm" ).dialog({
    autoOpen: false,
    show: {
      effect: "blind",
      duration: 1000
    },
    hide: {
	    effect: "blind",
      duration: 1000
    },
  });

  $( "#detailForm" ).dialog( "option", "maxHeight", 600 );
  $( "#detailForm" ).dialog( "option", "width", 800 );
	
	// recherche du token
	getToken();
});

/**
* Récupère le token 
* et appelle la fonciton pour initailiser la liste des formulaires
*
**/
function getToken() {
	var url = _URL+'login';
	var data = {user:'stakiz', password:'mdpstakizeo', company:'STAKIZ'};

	$.ajax({
		 type: "POST",
		 url: url,
		 data: JSON.stringify(data),
		 contentType: "application/json; charset=utf-8",
		 dataType: "json",
		 success: function (data, status, jqXHR) {
		 		var token =  data.data.token;
		 		// Récupération de la liste des formulaires
		 		getFormList(token);
		 		
		 },

		 error: function (jqXHR, status) {
		     console.log('fail' + status.code);
		 }
	});
}


/**
* Récupération par webService de la liste des formulaires 
*
* @param token : Authentification
* 
**/
function getFormList(token=''){
	var url = _URL+'forms';
	var urlAjax = $.ajax({
	    url : url,
	    method : 'GET',
	    beforeSend : function(req) {
	    	// Envoi du token dans le header de la requete
	        req.setRequestHeader('Authorization', token);
	    },

	    success: function (data, status, jdXHR) {
			 // Initialisation de la dataTable
				initDataTable(data);

				// Sur clic détail, ouverure d'une modal et surlignage de la ligne du tableau en info
 				$( ".opener" ).on( "click", function() {
 					$('.info').removeClass('info');
 					$( '#'+this.id).parent().parent().addClass('info');
 					// Ouverture de la modale détail
 					getFormID(this.id, token);
					
    		}).bind(this);
	    	
	    },
	    error: function (jqXHR, status) {
		     console.log('fail' + status.code);
		 }
	});	
	 
}

/**
* Initialise la dataTable
*
* @data : liste des formulaires
**/

function initDataTable(data) {
	moment.locale('fr');
	$('#kizeoForms').DataTable( {
		 		language: {search: "Rechercher" }, // personalisation du mot search
        info : false,											 // Enlève les infos en bas de la table
		 	 	paging: false,										 // Enlève la pagination
		      data: data.forms,									// affichage des données
					"order": [[ 2, 'asc' ], [ 3, 'asc' ]], // tri par rubrique et nom par défaut
      	"columns": [
      		// Ajout d'une colonne détail pour afficher dans une modale le détail en fonction d'un ID sur clic
      		{ "data": "id",
      		"orderable": false, 
      		"render": function ( id ) {
    				return getDetailClic(id);
 					 }
 					},
 					{ "data": "id" },
          { "data": "class" },
          { "data": "name" },
          // Affichage avec moment.js de la date au format Long
          { "data": "update_time",
          	"render": function(update_time) {
          		return moment(update_time).format('dddd') + ' '
          						+ moment(update_time).format('DD') + ' '
          						+ moment(update_time).format('MMMM') + ' à '
          						+ moment(update_time).format('LTS');
          	} },

          // Affichage de case à cocher avec le bon libellé true ou false du seeHisto
          { "data": "options",
           "orderable": false,
          "render": function ( options ) {
    				return getCheckBox(options,'see');
 					 }},
 					 // Affichage de case à cocher avec le bon libellé true ou false du updateHisto
 					 { "data": "options",
 					  "orderable": false,
          	"render": function ( options ) {
    				return getCheckBox(options,'update');
 					 }}  
        ]
	} );
}
/**
* Appel webservice pour aller chercher les info d'un formulaire 
*
* @id : Id du formulaire
* @token: authentification
*
**/
function getFormID(id, token) {
	var url = _URL+'forms/'+id;
	$.ajax({
	    url : url,
	    method : 'GET',
	    beforeSend : function(req) {
	        req.setRequestHeader('Authorization', token);
	    },
	    success: function (data, status, jdXHR) {
	    	// Affichage du JSON
	    	$("#jsonData").html(JSON.stringify(data, undefined, 2));
				// Customisation du titre
				$( "#detailForm" ).dialog( {"title": "Détail pour l'id: "+id});
				// Ouverure de la modale
	    	$( "#detailForm" ).dialog( "open" );
	    },
	    error: function (jqXHR, status) {
		     console.log('fail' + status.code);
		 }
	});
}

/**
* Retourne le bouton détail avec l id correspoondant a la ligne de la table
*
* @id : ID du formulaire
**/ 

function getDetailClic(id) {
	return '<button id="'+id+'" class="opener btn btn-info" title="Détail"> <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></button>'
}

/**
* Retourne deux checkbox avec le label correspondant à ture et false
* 
* @options : Données avec les options
* @type: see ou upadte histo
**/
function getCheckBox(options, type){
	var checked = '';
	if (type === 'see') {
			if (options.allUsersSeeHisto == 'O') checked = 'checked';
	} else 	if (type === 'update'){
			if (options.allUsersUpdateHisto == 'O') checked = 'checked';
	}
	var cb = ' <fieldset disabled><div class="checkbox"><label><input type="checkbox" id="cbox1" value="checkbox1" '+checked+' readonly>'+options.checkboxOutputFalseValue+'</label> ';
	cb += '<label><input type="checkbox" id="cbox2" value="checkbox2" '+checked+' readonly>'+options.checkboxOutputTrueValue+'</label></div></fieldset>';
	return cb;
}





