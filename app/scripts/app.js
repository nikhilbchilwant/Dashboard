'use strict';
/**
 * @ngdoc overview
 * @name dashboardApp
 * @description
 * # dashboardApp
 *
 * Main module of the application.
 */
 var dashboardModule = angular.module('dashboardApp', ['ngUpload']);

 dashboardModule.constant('CLIENT_ID', 
 	'1094966308802-ksdjf0f4h4gblprr663ie3a8hqmcei3o.apps.googleusercontent.com');
 dashboardModule.constant('SCOPES', ['https://www.googleapis.com/auth/drive.file']);

 var accessToken = null;

 dashboardModule.controller('showFiles', function($scope, CLIENT_ID, SCOPES){
 	
 	$scope.isAutherized = false;
 	
 	$scope.handleAuthClick = function() {

 		gapi.auth.authorize(
 			{client_id: CLIENT_ID, scope: SCOPES, immediate: false},
 			handleAuthResult);
 		return false;
 	};

 	function handleAuthResult(authResult) {

 		if (authResult && !authResult.error) {
 			$scope.isAutherized = true;
 			accessToken = authResult.access_token;

 			console.log('logged in successfully');
			//because we are using client.js from google API
			$scope.$apply();
			loadDriveApi();
			return true;
		} else {
			// Show auth UI, allowing the user to initiate authorization by
			// clicking authorize button.
			// authorizeDiv.style.display = 'inline';
			return false;
		}
	}

	  /**
	   * Load Drive API client library.
	   */
	   function loadDriveApi() {
	   	gapi.client.load('drive', 'v3', listFiles);
	   }

	  /**
	   * Print files.
	   */
	   function listFiles() {
	   	var request = gapi.client.drive.files.list({
	   		'pageSize': 10,
	   		'fields': 'nextPageToken, files(id, name)'
	   	});

	   	request.execute(function(resp) {

	   		var files = resp.files;
	   		$scope.files = resp.files;
	   		$scope.$apply();
	   		if (files && files.length > 0) {
	   			for (var i = 0; i < files.length; i++) {
	   				var file = files[i];
	   				// console.log(file.name + ' (' + file.id + ')');
	   			}
	   		} else {
	   			console.log('No files found.');
	   		}
	   	});
	   }
	});
