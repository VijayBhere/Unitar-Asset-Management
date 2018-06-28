angular.module('app', ['ionic','ngCordova', 'app.controllers', 'app.routes', 'app.directives','app.services',])

.config(function($ionicConfigProvider, $sceDelegateProvider){
	$sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);
})

.run(function($ionicPlatform, $rootScope, $state) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		
	});

	$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
		if (error == 'AUTH_REQUIRED') {
			$state.go('login');
		}
	});
})