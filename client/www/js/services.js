var apiUrl = 'http://18.217.59.77/AssetMgmt/'

angular.module('app.services', [])

.service('UserService', function($q, $http, LoaderService){
	var currentUser = null;

	this.login = function(credentials){
		LoaderService.showLoader();
		var deferred = $q.defer();
		
		$http({
			method: 'POST',
			url: apiUrl + 'login.php',
			headers: {'Content-Type': 'application/json'},
			data: credentials
		}).then(
			function(result){
				if(result.data.status){
					currentUser = result.data.username;
					deferred.resolve()
				}
				else
					deferred.reject("Username or password is not valid.");
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}

	this.getCurrentUserName = function(){
		return currentUser;
	}

	this.logout = function(){
		currentUser = null;
	}
})

.service('AssetService', function($q, $http, UserService, LoaderService){
	this.verifyAsset = function(barcode){
		LoaderService.showLoader();
		var deferred = $q.defer();
		
		$http({
			method: 'POST',
			url: apiUrl + 'verifyAsset.php',
			headers: {'Content-Type': 'application/json'},
			data: {
				'user_name': UserService.getCurrentUserName(),
				'barcode': barcode
			}
		}).then(
			function(result){
				if(!result.data.status && result.data.message.indexOf('Unauthorized') >= 0){
					deferred.reject(result.data.message);
				}
				else
					deferred.resolve(result.data);
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}

	this.registerAsset = function(asset){
		LoaderService.showLoader();
		var deferred = $q.defer();

		asset.created_username = UserService.getCurrentUserName();

		$http({
			method: 'POST',
			url: apiUrl + 'insertAsset.php',
			headers: {'Content-Type': 'application/json'},
			data: asset
		}).then(
			function(result){
				if(result.data.status){
					deferred.resolve()
				}
				else
					deferred.reject(result.data.message);
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}

	this.update = function(barcode, status, remarks){
		LoaderService.showLoader();
		var deferred = $q.defer();

		$http({
			method: 'POST',
			url: apiUrl + 'updateAsset.php',
			headers: {'Content-Type': 'application/json'},
			data: {
				unitar_barcode: barcode, 
				status: status,
				remarks: remarks,
				user: UserService.getCurrentUserName()
			}
		}).then(
			function(result){
				if(result.data.status){
					deferred.resolve()
				}
				else
					deferred.reject(result.data.message);
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}

	this.relocate = function(relocationData){
		LoaderService.showLoader();
		var deferred = $q.defer();

		$http({
			method: 'POST',
			url: apiUrl + 'relocateAsset.php',
			headers: {'Content-Type': 'application/json'},
			data: {
				asset: relocationData,
				user: UserService.getCurrentUserName()
			}
		}).then(
			function(result){
				if(result.data.status){
					deferred.resolve()
				}
				else
					deferred.reject(result.data.message);
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}

	this.delete = function(barcode){
		LoaderService.showLoader();
		var deferred = $q.defer();

		$http({
			method: 'POST',
			url: apiUrl + 'deleteAsset.php',
			headers: {'Content-Type': 'application/json'},
			data: {
				unitar_barcode: barcode,
				user: UserService.getCurrentUserName()
			}
		}).then(
			function(result){
				if(result.data.status){
					deferred.resolve()
				}
				else
					deferred.reject(result.data.message);
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}
})

.service('DataService', function($q, $http, LoaderService, UserService){
	this.getAllProgrammes = function(){
		LoaderService.showLoader();
		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: apiUrl + 'getAllProgramme.php',
		}).then(
			function(result){
				if(result.data.status){
					deferred.resolve(result.data.programmes)
				}
				else
					deferred.reject(result.data.message);
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}

	this.getAllCategories = function(){
		LoaderService.showLoader();
		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: apiUrl + 'getAllCategories.php',
		}).then(
			function(result){
				if(result.data.status){
					deferred.resolve(result.data.categories)
				}
				else
					deferred.reject(result.data.message);
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}

	this.getRoomsAndUsersByProgramme = function(programme){
		LoaderService.showLoader();
		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: apiUrl + 'getRoomsAndUsersByProgramme.php?programme=' + programme,
		}).then(
			function(result){
				if(result.data.status){
					deferred.resolve(result.data)
				}
				else
					deferred.reject(result.data.message);
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}

	this.getAssetAndAllProgrammes = function(barcode){
		LoaderService.showLoader();
		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: apiUrl + 'getAssetAndAllProgramme.php?barcode=' + barcode + '&userName=' + UserService.getCurrentUserName(),
		}).then(
			function(result){
				console.log(result);
				if(result.data.status){
					deferred.resolve(result.data)
				}
				else
					deferred.reject(result.data.message);
				LoaderService.hideLoader();
			},
			function(error){
				console.log(error);
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}

	this.getAssetsByRoom = function(room_no){
		LoaderService.showLoader();
		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: apiUrl + 'getAssetsByRoom.php?roomNo=' + room_no + '&userName=' + UserService.getCurrentUserName(),
		}).then(
			function(result){
				if(result.data.status){
					deferred.resolve(result.data)
				}
				else
					deferred.reject(result.data.message);
				LoaderService.hideLoader();
			},
			function(error){
				deferred.reject(error.reason || error.message);
				LoaderService.hideLoader();
			}
		)
		
		return deferred.promise;
	}
})

.service('LoaderService', function($ionicLoading){
	this.showLoader = function(){
		$ionicLoading.show({
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
	}
	
	this.hideLoader = function(){
		$ionicLoading.hide();
	}
})

.service('DialogService', function($ionicPopup){
	this.showConfirmDialog = function(title, template){
		var confirm = $ionicPopup.confirm({
			title: title,
			template: template,
			cancelText: "No",
			okText: "Yes",
			okType: "button-positive"
		});

		return confirm;
	}

	this.showAlert = function(title, message){
		return $ionicPopup.alert({
			title: title,
			template: message,
			okType: "button-positive"
		});
	}
})

;