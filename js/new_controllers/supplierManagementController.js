app.controller('supplierManagementController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory',    
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory){ 
	
	$rootScope.stateParams = angular.copy($state.params);

	var clearFilter = function () {
		$scope.filters = {
			supplier_name: '',
			address: '',
			phone_number: ''
		};
	}

	var clearForm = function () {
		$scope.mainForm = {
			supplier_name: {
				value: '',
				error: '',
				validPattern: 'required'
			},
			address: {
				value: '',
				error: '',
				validPattern: 'required'
			},
			phone_number: {
				value: '',
				error: '',
				validPattern: 'required'
			},
			id: {
				value: '',
				error: '',
				validPattern: ''
			}
		};
		clearFilter();
	}
	clearForm();

	$scope.arrCategories = frontEndData.supplier_name;

	$scope.clearState = function () {
		clearForm();
	}

	$scope.tableData = [];
	var getTableData = function () {
		apiFactory.master
			.getSupplier()
			.then(function(retData) {
				if(retData.status === 200) {
					$scope.tableData = retData.data || [];
				} else {
					$scope.tableData = [];
				}
			});
	}
	getTableData();

	var clearErrors = function () {
		$scope.mainForm.supplier_name.error = '';
		$scope.mainForm.address.error = '';
		$scope.mainForm.phone_number.error = '';
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

		if(!$scope.mainForm.supplier_name.value) {
			$scope.mainForm.supplier_name.error = true;
			return false;
		}
		if(!$scope.mainForm.address.value) {
			$scope.mainForm.address.error = true;
			return false;
		}
		if(!$scope.mainForm.phone_number.value) {
			$scope.mainForm.phone_number.error = true;
			return false;
		}

		var formattedData = formatFormData();
		if(!!$scope.mainForm.id.value) { // Update
			apiFactory.master
				.saveSupplier({
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
				});
		} else { // Insert
			apiFactory.master
				.updateSupplier({
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
				});
		}
	}

}]);
