'use strict';
/**
 * @ngdoc overview
 * @name dashboardApp
 * @description
 * # dashboardApp
 *
 * Main module of the application.
 */
 var dashboardModule = angular.module('dashboardApp', ['ngUpload'/*'angular-google-gapi'*/]);
 var accessToken = null;

 dashboardModule.controller('showFiles', function($scope/*, gapi*/){
 	var CLIENT_ID = '1094966308802-ksdjf0f4h4gblprr663ie3a8hqmcei3o.apps.googleusercontent.com';
 	var SCOPES = ['https://www.googleapis.com/auth/drive.file'];
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

 var uploadFile = function(content){
 	var uploader = new MediaUploader({
 		file: content,
 		token: accessToken,
 		onComplete: function(data) {
 		}
 	});
 	uploader.upload();		   	
 };

 dashboardModule.directive('fileDropzone', function() {
 	return {
 		restrict: 'A',
 		scope: {
 			file: '=',
 			fileName: '='
 		},
 		link: function(scope, element, attrs) {
      	// console.log('triggered');
      	var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
      	processDragOverOrEnter = function(event) {
      		if (event !== null) {
      			event.preventDefault();
      		}
			// console.log(event);
			event.originalEvent.dataTransfer.effectAllowed = 'copy';

			return false;
		};
		validMimeTypes = attrs.fileDropzone;
		checkSize = function(size) {
			var _ref;
			if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
				return true;
			} else {
				alert('File must be smaller than ' + attrs.maxFileSize + ' MB');
				return false;
			}
		};
		isTypeValid = function(type) {
			if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
				return true;
			} else {
				alert("Invalid file type.  File must be one of following types " + validMimeTypes);
				return false;
			}
		};
		element.bind('dragover', processDragOverOrEnter);
		element.bind('dragenter', processDragOverOrEnter);
		return element.bind('drop', function(event) {
			var file, name, reader, size, type;
			if (event !== null) {
				event.preventDefault();
			}
			reader = new FileReader();
			reader.onload = function(evt) {
				if (checkSize(size) && isTypeValid(type)) {
					return scope.$apply(function() {
						scope.file = evt.target.result;
						if (angular.isString(scope.fileName)) {
							scope.fileName = name;
							return name;
						}
					});
				}
			};
			file = event.originalEvent.dataTransfer.files[0];
			name = file.name;
			type = file.type;
			size = file.size;
			reader.readAsDataURL(file);
			uploadFile(file);
			return false;
		});
	}
};
});