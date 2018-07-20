
angular.module('WhoStoryApp')
.controller('WhoStoryDetailController', ['WhoStoryService', '$route', function (WhoStoryService, $route) {

    var my = this,
        storyDetailName = $route.current.params.storyName //gets story name from URL      
    ;
    
    my.isDataError = false;
    
    WhoStoryService.storyDetail(storyDetailName, function (details) { //The data was found 
        
        my.storyDetails = details;

        
    }, function (err) { //The data was not found so hide and show error (uses ng-show/hide based on my.isDataError)
        
        my.errorMessage = 'Sorry, but there was a problem retrieving the data for this story. Error: ' + err;
        my.isDataError = true;        
        
    });

}]);