angular.module('app.controllers', [])

.controller('LoginCtrl', ['$scope', '$state', '$ionicHistory', 'UserService', 'DialogService', 
function ($scope, $state, $ionicHistory, UserService, DialogService) {
	$scope.userCredentials = {user_name: '', pwd: ''};
	
	$scope.$on('$ionicView.enter', function(event, data){
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
	})
	
	$scope.signin= function(){
		UserService.login($scope.userCredentials).then(
			function(result){
				$ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true })
				$state.go("home")
			},
			function(error){
				DialogService.showAlert('Oops!', error);
			}
		)
	}
}])

.controller('HomeCtrl', ['$scope', '$state', '$ionicHistory', 'UserService',
function ($scope, $state, $ionicHistory, UserService) {
	$scope.$on('$ionicView.enter', function(event, data){
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
	})
	
	$scope.logout = function(){
		UserService.logout();
		$state.go('login');
	}
}])

.controller('ScanAssetCtrl', ['$scope', '$stateParams', '$state', 'AssetService', 'DialogService',
function ($scope, $stateParams, $state, AssetService, DialogService) {
	$scope.options = {scanType: 'asset'};
	$scope.showScanTypeDropdown = $stateParams.function == 'verify';
	
	$scope.title = 'Physical Verification';
	if($stateParams.function == 'relocate')
		$scope.title = 'Asset Relocation';

	$scope.setScanType = function(scanType){
		$scope.options.scanType = scanType;
	}
	
	var getAsset = function(barcode){
		AssetService.verifyAsset(barcode).then(
			function(result){
				if(result.status)
					$state.go('validAsset', {asset: result.asset});
				else
					$state.go('invalidAsset', {barcode: barcode});
			},
			function(error){
				DialogService.showAlert('Oops!', 'Verifying asset failed: ' + error + ' Barcode: ' + barcode).then(
					function(){
						$state.go('home');
					}
				);
			}
		)
	}

	$scope.processBarcode = function(barcode){
		if(!barcode){
			DialogService.showAlert('Oops!', 'Received barcode is invalid as it is an empty text value.');
			return;
		}

		if($stateParams.function == 'verify'){
			if($scope.options.scanType == 'asset'){
				getAsset(barcode);
				return;
			}
			
			if($scope.options.scanType == 'room'){
				$state.go('roomWiseAssets', {room_no: barcode});
				return;
			}
		}
		else{
			$state.go('relocateAsset', {barcode: barcode});
		}
	}
	
	$scope.scanBarcode = function(){
		if(window.cordova && window.cordova.plugins && window.cordova.plugins.barcodeScanner){
			cordova.plugins.barcodeScanner.scan(
				function (result) {
					if(!result.cancelled)
						$scope.processBarcode(result.text);
				},
				function (error) {
					DialogService.showAlert('Oops!', 'Scanning failed: ' + error);
				}
			);
		}
		else{
			DialogService.showAlert('Oops!', 'Barcode scanning is currently not available.');
		}
	}
}])

.controller('InvalidAssetCtrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {
	$scope.barcode = $stateParams.barcode;
}])

.controller('ValidAssetCtrl', ['$scope', '$state', '$stateParams', 'DialogService', 'AssetService', 
function ($scope, $state, $stateParams, DialogService, AssetService) {
	$scope.asset = $stateParams.asset;
	
	$scope.updateAsset = function(){
		DialogService.showConfirmDialog('Save Asset', 'Are you sure you want to update the asset?').then(
			function(res){
				if(res){
					AssetService.update($scope.asset.unitar_barcode, $scope.asset.status, $scope.asset.remarks).then(
						function(result){
							DialogService.showAlert('Success!', 'Asset status has been updated.');
						},
						function(error){
							DialogService.showAlert('Oops!', 'Status updation failed: ' + error);
						}
					)
				}
			}
		)
	}

	$scope.deleteAsset = function(){
		DialogService.showConfirmDialog('Delete Asset', 'Are you sure you want to delete the asset?').then(
			function(res){
				if(res){
					AssetService.delete($scope.asset.unitar_barcode).then(
						function(result){
							DialogService.showAlert('Success!', 'Asset has been deleted.').then(
								function(){
									$state.go('home');
								}
							);
						},
						function(error){
							DialogService.showAlert('Oops!', 'Asset deletion failed: ' + error);
						}
					)
				}
			}
		)
	}
}])

.controller('RegisterAssetCtrl', ['$scope', '$state', '$stateParams', 'AssetService', 'DataService', 'DialogService', 
function ($scope, $state, $stateParams, AssetService, DataService, DialogService) {
	$scope.barcode = $stateParams.barcode;
	
	$scope.asset = {
		unitar_barcode: $stateParams.barcode,
		serial_num: "",
		receipt_id: "",
		description: "",
		programme: "",
		purchase_year: "",
		price: "",
		item_num: "",
		category: "",
		curent_user: "",
		status: "active",
		remarks: "",
		last_inventory_date: "",
		expiry_date: "",
		created_username: "",
		room_no: ""
	}
	
	DataService.getAllProgrammes().then(
		function(result){
			$scope.programmes = result;
		},
		function(error){
			DialogService.showAlert('Oops!', 'Getting programmes failed: ' + error);
		}
	)
	
	DataService.getAllCategories().then(
		function(result){
			$scope.categories = result;
		},
		function(error){
			DialogService.showAlert('Oops!', 'Getting categories failed: ' + error);
		}
	)
	
	$scope.$watch('asset.programme', function(newValue){
		if(!newValue) return;
		
		for(var i=0; i<$scope.programmes.length; i++){
			if($scope.programmes[i].id == newValue){
				DataService.getRoomsAndUsersByProgramme($scope.programmes[i].name).then(
					function(result){
						$scope.rooms = result.rooms;
						$scope.users = result.users;
					},
					function(error){
						DialogService.showAlert('Oops!', 'Getting rooms and users failed: ' + error);
					}
				)
			}
		}
	})
	
	$scope.registerAsset = function(){
		AssetService.registerAsset($scope.asset).then(
			function(result){
				$state.go('home');
			},
			function(error){
				DialogService.showAlert('Oops!', 'Registering asset failed: ' + error);
			}
		);
	}
}])

.controller('RelocateAssetCtrl', ['$scope', '$state', '$stateParams', 'DataService', 'AssetService', 'DialogService', 
function ($scope, $state, $stateParams, DataService, AssetService, DialogService) {
	$scope.tempDetails = {
		programme: '',
		curent_user: '',
		room_no: ''
	}
	
	DataService.getAssetAndAllProgrammes($stateParams.barcode).then(
		function(result){
			$scope.asset = result.asset;
			$scope.programmes = result.programmes;

			if(!$scope.asset){
				DialogService.showAlert('Oops!', 'Searching asset failed: Asset not found. Barcode: ' + $stateParams.barcode).then(
					function(){
						$state.go('home');
					}
				);
				return;
			}
			
			$scope.tempDetails.unitar_barcode = $scope.asset.unitar_barcode;
			$scope.tempDetails.programme = $scope.asset.programme;
			$scope.tempDetails.curent_user = $scope.asset.curent_user;
			$scope.tempDetails.room_no = $scope.asset.room_no;
		},
		function(error){
			DialogService.showAlert('Oops!', 'Searching asset failed: ' + error).then(
				function(){
					$state.go('home');
				}
			);
		}
	)
	
	$scope.$watch('tempDetails.programme', function(newValue){
		if(!newValue) return;
		
		for(var i=0; i<$scope.programmes.length; i++){
			if($scope.programmes[i].id == newValue){
				DataService.getRoomsAndUsersByProgramme($scope.programmes[i].name).then(
					function(result){
						$scope.rooms = result.rooms;
						$scope.users = result.users;
					},
					function(error){
						DialogService.showAlert('Oops!', 'Getting programmes failed: ' + error);
					}
				)
			}
		}
	})
	
	$scope.relocateAsset = function(){
		AssetService.relocate($scope.tempDetails).then(
			function(result){
				DialogService.showAlert('Success!', 'Asset has been relocated.').then(
					function(){
						$state.go('home');
					}
				);
			},
			function(error){
				DialogService.showAlert('Oops!', 'Relocating asset failed: ' + error);
			}
		)
	}
	
}])

.controller('RoomWiseAssetsCtrl', ['$scope', '$state', '$stateParams', 'DataService', 'DialogService', 
function ($scope, $state, $stateParams, DataService, DialogService) {
	DataService.getAssetsByRoom($stateParams.room_no).then(
		function(result){
			$scope.room = result.room;
			$scope.assets = result.assets;
		},
		function(error){
			DialogService.showAlert('Oops!', 'Searching assets failed: ' + error + ' Barcode: ' + $stateParams.room_no).then(
				function(result){
					$state.go('home');
				}
			);
		}
	)

	$scope.getDate = function(dateString){
		return new Date(dateString);
	}
}])