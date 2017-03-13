<?php

	$url = 'https://www.kizeoforms.com/rest/v3/login';
	
	$data = array(
		'user' => $_POST['user'],
		'password' => $_POST['password'],
		'company' =>  $_POST['company']);	
	$data_string = json_encode($data);


	//Ouverture de la session curl
	$ch = curl_init();

	//set the url, number of POST vars, POST data
	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");  
	curl_setopt($ch, CURLOPT_POST,true);
	curl_setopt($ch, CURLOPT_POSTFIELDS,$data_string);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
	    'Content-Type: application/json',                                                                                
	    'Content-Length: ' . strlen($data_string))                                                                       
	);      


	$result = curl_exec ($ch); 
	
	// Fermeture de la session cURL
	curl_close($ch);
	$jsonResult = json_decode($result, true);
	echo ($jsonResult['data']['token']);  

?>