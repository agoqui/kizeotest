const _URL = 'https://www.kizeoforms.com/rest/v3/'; // URL du webService

$(document).ready(function() {
	initConnectForm();
	initDetailForm();
	
});

/**
* Gestion du formulaire de connection
*
**/
function initConnectForm() {
	$('#labelError').hide();
	$('#kizeoForms').hide();
	$('#userDisconnect').hide();

	// Connection
  $('#userConnect').on('click', function(e) {
		var err = false;
		$('#labelError').hide();
		$('#userDisconnect').hide();

		// Vérification champ formulaire
		$('#user').parent().removeClass('has-error');
		$('#password').parent().removeClass('has-error');
		$('#company').parent().removeClass('has-error');
		if ($('#user').val() === "") { $('#user').parent().addClass('has-error'); err = true; }
		if ($('#password').val() === "") { $('#password').parent().addClass('has-error'); err = true; }
		if ($('#company').val() === "") { $('#company').parent().addClass('has-error'); err = true; }
			
			if (err) {
				return false;
		} 

		// récupération du token
		if($('#bycurl').is(':checked')) getTokenByCurl($('#user').val(), $('#password').val(), $('#company').val());
		else getToken($('#user').val(), $('#password').val(), $('#company').val());
  });

  // Déconnection
  $('#userDisconnect').on('click', function(e) {
  	$('#kizeoForms').DataTable().destroy();
		$('#kizeoForms').hide();
  	$('#labelError').hide();
		$('#userDisconnect').hide();
		$('#connectForm').show();
  });


}

/**
* Initialise la modale de détail
**/
function initDetailForm(){
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
}
/**
* Récupère le token via une requete curl sous php
* et appelle la fonciton pour initailiser la liste des formulaires
*
**/
function getTokenByCurl(user, password, company) {
	var dataPost = {user: user, password: password, company: company};
	$.post('./token.php', 
			dataPost, 
     	function(data, status) {
        	if(data !='') {
	        	$('#labelError').hide();
						$('#connectForm').hide();
						$('#userDisconnect').show();
						$("#userConnectedLabel").html(' Déconnectez ' + user);
        		var token =  data;	
        		// Récupération de la liste des formulaires
		 				getFormList(token);
        	} else {
        		$('#labelError').show();
        		 console.log('failed');
        	}
	});


}

/**
* Récupère le token 
* et appelle la fonciton pour initailiser la liste des formulaires
*
**/
function getToken(user, password, company) {
	var url = _URL+'login';
	var data = {user: user, password: password, company: company};

	$.ajax({
		 type: "POST",
		 url: url,
		 data: JSON.stringify(data),
		 contentType: "application/json; charset=utf-8",
		 dataType: "json",
		 success: function (data, status, jqXHR) {

			$('#labelError').hide();
			$('#connectForm').hide();
			$('#userDisconnect').show();
		 		var token =  data.data.token;
		 		
		 		$("#userConnectedLabel").html(' Déconnectez ' + user);
		 		// Récupération de la liste des formulaires
		 		getFormList(token);
		 		
		 },

		 error: function (jqXHR, status) {
				$('#labelError').show();
		     console.log('fail TOKEN' + status.code);
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
	$.ajax({
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
 					$('.success').removeClass('success');
 					$( '#'+this.id).parent().parent().addClass('success');
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
	$('#kizeoForms').show();
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
          		return formatLong(update_time);
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

function formatLong(date) {
	return moment(date).format('dddd') + ' '
         + moment(date).format('DD') + ' '
         + moment(date).format('MMMM') + ' à '
         + moment(date).format('LTS');
}
/**
* Appel webservice pour aller chercher les différentes données saisies sur un formulaire
*
* @id : Id du formulaire
* @token: authentification
*
**/
function getFormID(id, token) {
	var url = _URL+'forms/'+id+'/data';
	$.ajax({
	    url : url,
	    method : 'GET',
	    beforeSend : function(req) {
	        req.setRequestHeader('Authorization', token);
	    },
	    success: function (data, status, jdXHR) {
	    	if(data.data.length > 0) {
	    		var id_data = data.data.id;
	    		
	    		var urlFormDataId = 	_URL+'forms/'+id+'/data/'+id_data;
	    		$.ajax({ 
						url : urlFormDataId,
						method : 'GET',
						beforeSend : function(req) {
							req.setRequestHeader('Authorization', token);
							},
						success: function (data, status, jdXHR) {
							// transforme les dates en format long
							if(data.data[0].create_time) data.data[0].create_time = formatLong(data.data[0].create_time);
							if(data.data[0].update_time) data.data[0].update_time = formatLong(data.data[0].update_time);
							if(data.data[0].update_answer_time) data.data[0].update_answer_time = formatLong(data.data[0].update_answer_time);
							if(data.data[0].answer_time) data.data[0].answer_time = formatLong(data.data[0].answer_time);
							
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
		    	
	    	} else {
	    		$("#jsonData").html(JSON.stringify(data, undefined, 2));
					// Customisation du titre
					$( "#detailForm" ).dialog( {"title": "Détail pour l'id: "+id});
					// Ouverure de la modale
		    	$( "#detailForm" ).dialog( "open" );	
						
	    	}
	    	
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
	return '<button id="'+id+'" class="opener btn btn-success" title="Détail"> <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></button>'
}

/**
* Retourne deux checkbox avec le label correspondant à ture et false
* 
* @options : Données avec les options
* @type: see ou upadte histo
**/
function getCheckBox(options, type){
	var checkedTrue =  checkedFalse = '';
	if (type === 'see') {
			if (options.allUsersSeeHisto == 'O') checkedTrue = 'checked';
			else checkedFalse = 'checked';
	} else 	if (type === 'update'){
			if (options.allUsersUpdateHisto == 'O') checkedTrue = 'checked';
			else checkedFalse = 'checked';
	}
	var cb = ' <fieldset disabled><div class="checkbox"><label><input type="checkbox" id="cbox1" value="checkbox1" '+checkedFalse+' readonly>'+options.checkboxOutputFalseValue+'</label> ';
	cb += '<label><input type="checkbox" id="cbox2" value="checkbox2" '+checkedTrue+' readonly>'+options.checkboxOutputTrueValue+'</label></div></fieldset>';
	return cb;
}





