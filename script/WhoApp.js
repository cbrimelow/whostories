var WhoStoryApp = angular.module('WhoStoryApp', ['ngRoute', 'ngAnimate']);

WhoStoryApp.config(['$routeProvider', function ($routeProvider) {
    
    $routeProvider.when('/results', {
        
        templateUrl: 'views/results.html',
        controller: 'WhoStoryController',
        controllerAs: 'storyControl'
        
    }).when('/detail/:storyName', {
        
        templateUrl: 'views/detail.html',
        controller: 'WhoStoryController',
        controllerAs: 'storyControl'
        
    }).otherwise({
        
        redirectTo: '/results'
        
    });
    
}]);

WhoStoryApp.service('WhoStoryService', ['$http', function ($http) {
	
    this.storyList = function (cbSuccess, cbError) {
        
        $http.get('script/data.json').then(
            
            function (resp) {
                
                cbSuccess(resp.data);
                
            },
            function (resp) {
                
                cbError(resp.statusText);
                
            }
        );
        
    };
    
    this.GlobalPageNum = 1;
    this.GlobalStartingPoint = 0;
    this.GlobalKeyword = '';
    this.GlobalKeywordStr = '';
    this.GlobalSeason = '';
    this.GlobalStoryOrder = 'transnum';
    this.GlobalReverse = false;
    this.GlobalHideSettings = false;
	
}]);

WhoStoryApp.controller('WhoStoryController', ['WhoStoryService', '$filter', '$route', function (WhoStoryService, $filter, $route) {
	
    var my = this,
        debug = false                                          
    ;
    
    my.isDataError = false;
    
    WhoStoryService.storyList(function (list) {

        var storyData = list;

        my.resultsPerPage = 5;
        my.startingPoint = WhoStoryService.GlobalStartingPoint;
        my.pagingTotalResults = storyData.length;
        my.pagingTotalPages = Math.ceil(my.pagingTotalResults / my.resultsPerPage);
        my.pagingcurrentPage = WhoStoryService.GlobalPageNum;
        my.keyword = WhoStoryService.GlobalKeyword;
        my.season = WhoStoryService.GlobalSeason;
        my.storyOrder = WhoStoryService.GlobalStoryOrder;
        my.reverse = WhoStoryService.GlobalReverse;
        my.pagingKeywordStr = WhoStoryService.GlobalKeywordStr;
        my.storyPages = {};
        my.seasonArray = [];
        my.storyDetailName = $route.current.params.storyName;
        my.storyDetails = {};
        my.hideSettings = WhoStoryService.GlobalHideSettings;

        var getStoryDetails = function () {

            for (var i = 0, theStories = storyData.length; i < theStories; i++) {                  
                
                if (storyData[i].shorttitle === my.storyDetailName) {
                    
                    my.storyDetails = storyData[i];
                    
                }
                
            }

        };
        
        getStoryDetails();
        
        var printPages = function (currPage) {

            my.storyPages = {};            
            my.pagingcurrentPage = currPage;

            if (my.pagingTotalResults > 0) {

                for (var i = 1, totalPages = my.pagingTotalPages; i <= totalPages; i++) {                  
                    my.storyPages[i] = i;
                }

            }

        };

        var printSeasons = function () {

            for (var i = 0, totalResults = my.pagingTotalResults; i < totalResults; i++) {                  

                if (my.seasonArray.indexOf(storyData[i].season) === -1) {
                    my.seasonArray.push(storyData[i].season);
                    
                }

            }  

        }; 
        
        var updateResults = function () {
            
            if (debug) {
                console.log('my.keyword=' + my.keyword+ ', my.season=' +my.season + ', my.storyOrder=' +my.storyOrder + ', my.reverse=' + my.reverse + '\n ');
            }
            
            var initFilter = storyData;
            
            if (my.keyword !== '') {
                initFilter = $filter('filter')(initFilter, my.keyword);
                
            } 
            
            if (my.season !== '') {
                initFilter = $filter('filter')(initFilter, my.season);
                
            }
            
            initFilter = $filter('orderBy')(initFilter, my.storyOrder, my.reverse);
            my.theStories = $filter('limitTo')(initFilter, my.resultsPerPage, my.startingPoint);                        
            my.pagingTotalResults = initFilter.length; 
            
            if (debug) {
                console.log('TotalResults: ' + my.pagingTotalResults);
            }
            
            my.pagingTotalPages = Math.ceil(my.pagingTotalResults / my.resultsPerPage);            
            printPages(my.pagingcurrentPage);
            
        };
        
        var init = function () {

            printPages(my.pagingcurrentPage);
            printSeasons(); 
            updateResults();
            
        };
        
        my.updateGlobalHideSetting = function () {
            
            my.hideSettings = !my.hideSettings;
            WhoStoryService.GlobalHideSettings = my.hideSettings;
            
        };        
        
        my.changePage = function (thePage) {

            my.startingPoint = (thePage * my.resultsPerPage) - my.resultsPerPage;
            WhoStoryService.GlobalStartingPoint = my.startingPoint;
            printPages(thePage);
            my.pagingcurrentPage = thePage;
            WhoStoryService.GlobalPageNum = thePage;
            updateResults();
            
        };
        
        my.setFilter = function (type, value) {
            
            if (type === 'keyword') {
                my.keyword = value;
                WhoStoryService.GlobalKeyword = my.keyword;
                my.pagingcurrentPage = 1;
                WhoStoryService.GlobalPageNum = 1;
                my.startingPoint = 0;
                WhoStoryService.GlobalStartingPoint = 0;

                if (value !== '') {
                    my.pagingKeywordStr = ' containing "' + my.keyword + '"';
                    
                } else {
                    my.pagingKeywordStr = '';
                    
                }
                
                WhoStoryService.GlobalKeywordStr = my.pagingKeywordStr;
                
            } else if (type === 'season') {
                my.season = value;
                WhoStoryService.GlobalSeason = my.season;
                my.pagingcurrentPage = 1;
                WhoStoryService.GlobalPageNum = 1;
                my.startingPoint = 0;
                WhoStoryService.GlobalStartingPoint = 0;
                
            } else if (type === 'sort') { 
                my.storyOrder = value;
                WhoStoryService.GlobalStoryOrder = my.storyOrder;
                
            } else if (type === 'reverse') {  
                my.reverse = value;
                WhoStoryService.GlobalReverse = my.reverse;
            }
            
            updateResults();
            
        };
        
        my.reset = function () {
            
            my.keyword = '';
            WhoStoryService.GlobalKeyword = '';
            my.pagingKeywordStr = '';
            WhoStoryService.GlobalKeywordStr = '';
            my.season = '';
            WhoStoryService.GlobalSeason = '';
            my.pagingcurrentPage = 1;
            WhoStoryService.GlobalPageNum = 1;
            my.startingPoint = 0;
            WhoStoryService.GlobalStartingPoint = 0;
            
            updateResults();
            
        };        

        init();

    }, function (err) {
        
        my.errorMessage = 'Sorry, but there was a problem retrieving the data for this app. Error: ' + err;
        my.isDataError = true;        
        
    });

}]);
