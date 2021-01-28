app.controller('userManagementController', [
				'$scope', '$rootScope', '$state', 'apiFactory', 'toaster', 'apiFactory',  
function($scope, 	$rootScope, 	$state, apiFactory, toaster, apiFactory){ 
	
	$rootScope.stateParams = angular.copy($state.params);
}]);
