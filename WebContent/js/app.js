var app = angular.module("gestionProduit", [ 'ui.router' ]);

app.config(function($stateProvider, $urlRouterProvider) {

	var homeState = {
		name : 'home',
		url : '/home',
		templateUrl : 'views/home.html',
		controller : 'HomeController'
	}

	var chercherState = {
		name : 'chercher',
		url : '/chercher',
		templateUrl : 'views/chercher.html',
		controller : 'myController'
	}

	var newProduitState = {
		name : 'newProduit',
		url : '/newProduit',
		templateUrl : 'views/newProduit.html',
		controller : 'NewProduitController'
	}

	var updateProduitState = {
		name : 'updateProduit',
		url : '/modifier/:id',
		templateUrl : 'views/modifier.html',
		controller : 'UpdateProduitController'
	}

	$stateProvider.state(homeState);

	$stateProvider.state(chercherState);

	$stateProvider.state(newProduitState);

	$stateProvider.state(updateProduitState);


});


app.controller("HomeController", function() {});

app.controller("NewProduitController", function($scope, $http) {
	$scope.produit = {};
	$scope.mode = 0;
	$scope.saveProduit = function() {
		$http.post("http://localhost:8080/produits", $scope.produit).then(function(result) {
			$scope.produit = result.data;
			$scope.mode = 1;
		}, function(err) {
			console.log(err.data.status + ' : ' + err.data.exception + ' -> ' + err.data.message);
		})
	}

	$scope.modeNew = function() {
		$scope.produit = {};
		$scope.mode = 0;
	}
});


app.controller("myController", function($scope, $http) {
	$scope.pageProduit = null;
	$scope.motCle = "";
	$scope.currentPage = 0;
	$scope.size = 3;
	$scope.pages = [];
	$scope.total = "";
	$scope.chercher = function() {
		$http.get("http://localhost:8080/chercher?design=" + $scope.motCle + "&page=" + $scope.currentPage + "&size=" + $scope.size).then(function(response) {
			data = response.data;
			$scope.pageProduit = data;
			$scope.total = data.totalPages;
			$scope.pages = new Array(data.totalPages);
		}, function(err) {
			console.log(err.data.status + ' : ' + err.data.exception + ' -> ' + err.data.message);
		});
	}

	$scope.chercherProduits = function() {
		$scope.currentPage = 0;
		$scope.chercher();
	}

	$scope.gotoPage = function(p) {
		$scope.currentPage = p;
		$scope.chercher();
	}

	$scope.deleteProd = function(id) {
		$http.delete("http://localhost:8080/produits/" + id).then(function(result) {
			$scope.chercherProduits();
			alert("Produit supprimé");
		}, function(err) {
			console.log(err.data.status + ' : ' + err.data.exception + ' -> ' + err.data.message);
		})
	}

});

app.controller("UpdateProduitController", function($scope, $http, $stateParams, $location) {
	var id = $stateParams.id;
	$scope.selectedProduit = {};
	$http.get("http://localhost:8080/produits/" + id).then(function(result) {
		$scope.selectedProduit = result.data;
	}, function(err) {
		console.log(err.data.status + ' : ' + err.data.exception + ' -> ' + err.data.message);
	})
	
	$scope.updateProduit = function() {
		$http.put("http://localhost:8080/produits/" + id, $scope.selectedProduit).then(function(result) {
			$scope.produit = result.data;
			alert('produit modifié');
			$location.path('chercher');
		}, function(err) {
			console.log(err.data.status + ' : ' + err.data.exception + ' -> ' + err.data.message);
		})
	}


});