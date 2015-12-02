<!DOCTYPE html>
<html ng-app="keyFinder">
 <head>
  <meta charset="utf-8" />
  <title>HTML5</title>
  <link rel="stylesheet" type="text/css" href="css/style.css" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
  <script src="js/app.js"></script>

 </head>
 <body>
	<div id="wrapper">
	<header>
	<h1>Поиск ключевых слов</h1>
	</header>
	
	<main id="form">
	<form class="form-inline" action="" method="post">
	 <div class="form-group">
	  <label>Ключевое слово</label>
	  <input type="text" class="form-control" ng-model="keyword.key" placeholder="Введите ключевое слово" name="keyword">
	 </div>	 
	 <div class="form-group">
	  <label>Страница</label>
	  <input type="text" class="form-control" ng-model="keyword.page" placeholder="Введите страницу" name="page">
	 </div>
	 <div class="form-group">
	  <label>Сайт</label>
	  <select class="form-control" ng-model="keyword.site" name="sites[]" ng-controller="sitelistController as sites">
	   <option selected="selected">Выберите сайт...</option>
	   <option ng-repeat="site in sites.sites" value="[[site.id]]">[[site.name]]</option>
	  </select>
	 </div>
	 <button class="btn btn-default" type="submit" name="submit">Погнали</button>
	</form>	
	</main>
	
	<footer ng-controller="keylistController as keylist">
	  <h2>Список слов:</h2>
	  <keyword-list></keyword-list>
	</footer>
	</div>
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
 </body>
</html>