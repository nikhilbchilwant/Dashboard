'use strict';
/**
 * @ngdoc overview
 * @name dashboardApp
 * @description
 * # dashboardApp
 *
 * Main module of the application.
 */
 var dashboardModule = angular.module('dashboardApp', ['ngUpload','ngAnimate', 'ui.bootstrap',
  'angular-google-gapi']);

 dashboardModule.constant('CLIENT_ID', 
 	'1094966308802-ksdjf0f4h4gblprr663ie3a8hqmcei3o.apps.googleusercontent.com');
 dashboardModule.constant('SCOPES', ['https://www.googleapis.com/auth/drive.file']);

 var accessToken = null;

 dashboardModule.controller('showFiles', ['$scope','driveUtil', function($scope, driveUtil){
 	
 	$scope.isAutherized = false;
 	
 	var SCOPES ='https://www.googleapis.com/auth/drive.file';
 	var CLIENT_ID ='1094966308802-ksdjf0f4h4gblprr663ie3a8hqmcei3o.apps.googleusercontent.com';

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
	   	gapi.client.load('drive', 'v3', driveUtil.listFiles);
	   }

	  /**
	   * Print files.
	   */
	   $scope.listFiles = function () {
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

	   				// file.isCollapsed=true;
	   				// console.log(file.name + ' (' + file.id + ')');
	   			}
	   		} else {
	   			console.log('No files found.');
	   		}
	   	});
	   }

	   $scope.expanding = function(file){		

	   	console.log('expanding');
	   	var request = gapi.client.drive.files.get({
	   		'fileId': file.id
	   	});
	   	request.execute(function(resp) {
	   		file.title=resp.title;
	   		file.description=resp.description;
	   		file.mimeType=resp.mimeType;

	   		/*console.log('Title: ' + resp.title);
	   		console.log('Description: ' + resp.description);
	   		console.log('MIME type: ' + resp.mimeType);*/
	   	});
	   }



	}]);
