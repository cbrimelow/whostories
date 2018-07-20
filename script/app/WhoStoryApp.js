
angular.module('WhoStoryApp', ['ngRoute', 'ngAnimate'])
.config(['$routeProvider', function ($routeProvider) {
    
    $routeProvider.when('/results', { //Route for main results page
        
        templateUrl: 'script/app/results/results.html',
        controller: 'WhoStoryResultController',
        controllerAs: 'storyControl'
        
    }).when('/detail/:storyName', { //Route for story details page
        
        templateUrl: 'script/app/detail/detail.html',
        controller: 'WhoStoryDetailController',
        controllerAs: 'storyControl'
        
    }).otherwise({ //Any other URL bounces to results page
        
        redirectTo: '/results'
        
    });
    
}]);