app.controller('adminManagementController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory',    
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory){ 
	
	$rootScope.stateParams = angular.copy($state.params);

	var clearFilter = function () {
		$scope.filters = {
			category: '',
			item_name: '',
			description: ''
		};
	}

	var clearForm = function () {
		$scope.mainForm = {
			category: {value: '',error: '',validPattern: 'required'},
			item_name: {value: '',error: '',validPattern: 'required'},
			description: {value: '',error: '',validPattern: ''},
			id: {value: '',error: '',validPattern: ''}
		};
		clearFilter();
	}
	clearForm();

	$scope.arrCategories = frontEndData.category;

	$scope.clearState = function () {
		clearForm();
	}

	$scope.tableData = [];
	var getTableData = function () {
		apiFactory.master
			.getAllMaster()
			.then(function(retData) {
				if(retData.status == 200) {
					$scope.tableData = retData.data || [];
				} else {
					$scope.tableData = [];
				}
			}, function(retData) {
				if(retData.status == 403) {
					$state.go('signin');
				}
			});
	}
	getTableData();

	var clearErrors = function () {
		$scope.mainForm.category.error = '';
		$scope.mainForm.item_name.error = '';
		$scope.mainForm.description.error = '';
		$scope.mainForm.id.error = '';
	}

	var formatFormData = function () {
		var temp = {};
		angular.forEach(Object.keys($scope.mainForm), function(v, i) {
			temp[v] = angular.copy($scope.mainForm[v].value);
		});
		return temp;
	}

	$scope.submitForm = function () {
		clearErrors();
		if(!$scope.mainForm.category.value) {
			$scope.mainForm.category.error = true;
			return false;
		}
		if(!$scope.mainForm.item_name.value) {
			$scope.mainForm.item_name.error = true;
			return false;
		}

		var formattedData = formatFormData();

		if(!!$scope.mainForm.id.value) { // Update
			apiFactory.master
				.updateMaster({
					data: formattedData
				})
				.then(function(retData) {
					if(retData.status === 200) {
						toaster.success('Data Updated Successfully');
						clearForm();
						getTableData();
					} else {
						toaster.error('Error in submitting the form. Please try again after some time.');
					}
				}, function(retData) {
					if(retData.status == 403) {
						$state.go('signin');
					}
				});
		} else { // Insert
			apiFactory.master
				.saveMaster({
					data: formattedData
				})
				.then(function(retData) {
					if(retData.status === 200) {
						toaster.success('Data Saved Successfully');
						clearForm();
						getTableData();
					} else {
						toaster.error('Error in submitting the form. Please try again after some time.');
					}
				}, function(retData) {
					if(retData.status == 403) {
						$state.go('signin');
					}
				});
		}
	}

}]);
