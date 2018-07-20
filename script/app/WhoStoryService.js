
angular.module('WhoStoryApp')
.service('WhoStoryService', ['$http', function ($http) { //This service is for getting external JSON data

    var dataUrl = 'script/data.json';
    
    //These public variables are for keeping the result state when going to the detail pages
    this.GlobalPageNum = 1;
    this.GlobalStartingPoint = 0;
    this.GlobalKeyword = '';
    this.GlobalKeywordStr = '';
    this.GlobalSeason = '';
    this.GlobalStoryOrder = 'transnum';
    this.GlobalReverse = false;
    this.GlobalHideSettings = false;
	
    //Gets full data set for results page
    this.storyList = function (cbSuccess, cbError) {
        
        $http.get(dataUrl).then(

            function (resp) { //Shows the result section if data is found

                cbSuccess(resp.data);

            },
            function (resp) { //Hides the results section and shows error if data is not found

                cbError(resp.statusText);

            }
        );
        
    };
	
    //Gets just a single story's data based on the story name (for detail page)
    this.storyDetail = function (storyName, cbSuccess, cbError) {
        
        $http.get(dataUrl).then(

            function (resp) { //Shows the detail page content if data is found

                //Loops through each story to try to match the story name ("shorttitle" from the data)
                for (var i = 0, theStories = resp.data.length; i < theStories; i++) {                  

                    if (resp.data[i].shorttitle === storyName) {

                        cbSuccess(resp.data[i]);

                    }

                }  

            },
            function (resp) { //Hides the details content and shows error if data is not found

                cbError(resp.statusText);

            }
        );        
     
        
    };    
	
}]);