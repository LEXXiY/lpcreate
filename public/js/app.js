(function() {
var app = angular.module('keyFinder', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
      });

app.controller('keylistController', ['$http', function($http){
    var list = this;
	list.keywords = [];
	
	$http.get('allkeys').success(function(data){
        list.keywords = data;
        console.log(data);
    });
}]);

app.directive('keywordList', function(){
	return {
		restrict: 'E',
		templateUrl: 'aview/keyword-list.html'
	};
});

app.controller('keyformController', function() {
  this.keyword = {};

  this.addKeyword = function(keyword) {
    keywords.keyword.push(this.keyword);

    this.keyword = {};
  };
});

app.controller('sitelistController', ['$http', function($http){
    var list = this;
	list.sites = [];
	
	$http.get('js/sites.json').success(function(data){
        list.sites = data;
    });
}]);
})();