app.controller('staffAttendanceController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory',  
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory){ 
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';
	$scope.maxDate = moment();


}]);
