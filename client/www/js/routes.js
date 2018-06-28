angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	
	.state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
	})
	
	.state('home', {
		url: '/home',
		templateUrl: 'templates/home.html',
		controller: 'HomeCtrl',
		resolve: {user: isAuthorized}
	})

	.state('scanAsset', {
		url: '/scanAsset',
		templateUrl: 'templates/scanAsset.html',
		params: {
			function: 'verify'
		},
		controller: 'ScanAssetCtrl',
		resolve: {user: isAuthorized}
	})

	.state('invalidAsset', {
		url: '/invalidAsset',
		templateUrl: 'templates/invalidAsset.html',
		params: {
			barcode: ''
		},
		controller: 'InvalidAssetCtrl',
		resolve: {user: isAuthorized}
	})

	.state('registerAsset', {
		url: '/registerAsset',
		templateUrl: 'templates/registerAsset.html',
		params: {
			barcode: ''
		},
		controller: 'RegisterAssetCtrl',
		resolve: {user: isAuthorized}
	})

	.state('validAsset', {
		url: '/validAsset',
		templateUrl: 'templates/validAsset.html',
		params: {
			asset: ''
		},
		controller: 'ValidAssetCtrl',
		resolve: {user: isAuthorized}
	})

	.state('relocateAsset', {
		url: '/relocateAsset',
		templateUrl: 'templates/relocateAsset.html',
		params: {
			barcode: ''
		},
		controller: 'RelocateAssetCtrl',
		resolve: {user: isAuthorized}
	})

	.state('roomWiseAssets', {
		url: '/roomWiseAssets',
		templateUrl: 'templates/roomWiseAssets.html',
		params: {
			room_no: ''
		},
		controller: 'RoomWiseAssetsCtrl',
		resolve: {user: isAuthorized}
	})
	
	$urlRouterProvider.otherwise('/home')
	
	
});

function isAuthorized($q, $timeout, UserService) {
	return $q(function(resolve, reject) {
		$timeout(function(){
			var currentUser = UserService.getCurrentUserName()
			currentUser ? resolve() : reject('AUTH_REQUIRED');
		})
	})
}

isAuthorized.$inject = ['$q', '$timeout', 'UserService'];