app.controller('priceDetailsController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'Upload', 'appConstants', '$state', 'blockUI', '$timeout', '$localStorage', 'formFactory', '$location',
function($scope, 	$rootScope, $state, toaster, frontEndData, apiFactory, Upload, appConstants, $state, blockUI, $timeout, $localStorage, formFactory, $location){ 
	
	$rootScope.stateParams = angular.copy($state.params);

  var getByPackageTypes = function () {
		$scope.arrPackageTypes = [];
		apiFactory.master
			.getByCategory({ category: 'pt' })
			.then(function (retData) {
				$scope.arrPackageTypes = retData.data || [];
			});
	}

	getByPackageTypes();

	$scope.updatePriceDetails = function(argRef){
		argRef.category = 'pt';
		apiFactory.master.updateMaster({
			data: argRef
		}).then(function(retData){
			toaster.success('Price details updated successfully.');
		});

	}	
		
}]);
