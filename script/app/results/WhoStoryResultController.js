
angular.module('WhoStoryApp')
.controller('WhoStoryResultController', ['WhoStoryService', '$filter', function (WhoStoryService, $filter) {
    
    var my = this,
        debug = false                                          
    ;
    
    my.isDataError = false;
    
    WhoStoryService.storyList(function (list) { //The data was found so load up the results

        var storyData = list;

        //Public variables (some of which reset the service globals)
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
        my.hideSettings = WhoStoryService.GlobalHideSettings;
        
        //Sets up the paging object based on number of results (uses ng-repeat in the HTML to print paging links)
        var printPages = function (currPage) {

            my.storyPages = {};            
            my.pagingcurrentPage = currPage;

            if (my.pagingTotalResults > 0) {

                for (var i = 1, totalPages = my.pagingTotalPages; i <= totalPages; i++) {                  
                    my.storyPages[i] = i;
                }

            }

        };

        //Grabs unique seasons from data and adds to array (loops through and prints dropdown options in HTML)
        var printSeasons = function () {

            for (var i = 0, totalResults = my.pagingTotalResults; i < totalResults; i++) {                  

                if (my.seasonArray.indexOf(storyData[i].season) === -1) {
                    my.seasonArray.push(storyData[i].season);
                    
                }

            }  

        }; 
        
        //Gets the new data set for results page (only what matches current filters and current page)
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
        
        //Activates when app is loaded
        var init = function () {

            printPages(my.pagingcurrentPage);
            printSeasons(); 
            updateResults();
            
        };
        
        //Public function for hiding/showing filter section (mobile only)
        my.updateGlobalHideSetting = function () {
            
            my.hideSettings = !my.hideSettings;
            WhoStoryService.GlobalHideSettings = my.hideSettings;
            
        };        
        
        //Public function for when new page is clicked on results page
        my.changePage = function (thePage) {

            my.startingPoint = (thePage * my.resultsPerPage) - my.resultsPerPage;
            WhoStoryService.GlobalStartingPoint = my.startingPoint;
            printPages(thePage);
            my.pagingcurrentPage = thePage;
            WhoStoryService.GlobalPageNum = thePage;
            updateResults();
            
        };
        
        //Public function that fires when any new filter or sort is used
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
        
        //Public function for resetting results from reset button (keeps the current sorting)
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

    }, function (err) { //Couldn't get the data so hide result section and show error (uses ng-show/hide based on my.isDataError)
        
        my.errorMessage = 'Sorry, but there was a problem retrieving the data for this app. Error: ' + err;
        my.isDataError = true;        
        
    });

}]);
