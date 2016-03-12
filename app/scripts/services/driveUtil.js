'use strict';

var dashboardModule = angular.module('dashboardApp');

dashboardModule.factory('driveUtil', ['$rootScope', function($rootScope){
    
  return {
    listFiles: function ()
    {
        
        var request = gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': 'nextPageToken, files(id, name)'
        });

        request.execute(function(resp) {           
            
            $rootScope.files = resp.files;
            $rootScope.$apply();
/*            if (files && files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    // file.isCollapsed=true;
                    // console.log(file.name + ' (' + file.id + ')');
                }
            } else {
                console.log('No files found.');
            }*/
        });
       
    }
  };
}]);