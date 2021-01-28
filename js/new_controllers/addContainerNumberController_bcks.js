app.controller('addContainerNumberController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory', 'Upload', 'appConstants',
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory, Upload, appConstants){ 
	$rootScope.stateParams = angular.copy($state.params);
	
	$scope.arrInvoiceNumbers = [];
	$scope.selectedInvoiceNumbers = [];
	$scope.formats = 'dd-MM-yyyy';
	
	var getAllNonContainerInvoiceNumbers = function(argValue) {
	    apiFactory.bt.getAllNonContainerInvoiceNumbers(argValue)
	        .then(function(retData) {
	            $scope.arrInvoiceNumbers = retData.data || [];
	        }, function(retData) {
	            $scope.arrInvoiceNumbers = [];
	        });
	}
// 	getAllNonContainerInvoiceNumbers('');

    $scope.keyValueExists = function (argArray, argKey, argValue) {
        return argArray.some(function(v) {
            return v[argKey] == argValue;
        });
    }
	
	$scope.onClickChooseInvoiceNumber = function(argRef) {
	    // argRef.selected = !argRef.selected;
	   // if(argRef.selected) {
	   if($scope.keyValueExists($scope.selectedInvoiceNumbers, 'id', argRef.id)) {
    	    // $scope.selectedInvoiceNumbers.push(argRef);
	    } else {
	        $scope.selectedInvoiceNumbers.push(argRef);
	    }
	}
	
	$scope.onClickRemoveThis = function(argIndex) {
	    $scope.selectedInvoiceNumbers.splice(argIndex, 1);
	}
	
	var clearForm = function () {
	    $scope.childForm = {
	        container_number: {
	            value: '',
	            error: '',
	            validPattern: 'required'
	        },
			loaded_date: {dispText: 'Loaded Date',value: '',error: '',validPattern: '',show: true},
	    };
	    getAllNonContainerInvoiceNumbers('');
	    $scope.selectedInvoiceNumbers = [];
	    $scope.query = '';
	}
	clearForm();
  $scope.openedLoaded = false;
  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 0,
    class: 'datepicker', 
    showWeeks: false
  };
	

  $scope.openLoaded = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedLoaded = true;
  };
  
  $scope.onChangeQuery = function () {
      getAllNonContainerInvoiceNumbers($scope.query);
  }
	
	$scope.onClickSaveChildForm = function() {
	    var formatedData = {
            container_number: angular.copy($scope.childForm.container_number.value),
            invoice_numbers: angular.copy($scope.selectedInvoiceNumbers),
            loaded_date: angular.copy($scope.childForm.loaded_date.value)
	    };
		if(!!formatedData.loaded_date) {
		    if(moment.isDate(formatedData.loaded_date)) {
		        formatedData.loaded_date = moment(formatedData.loaded_date).format('YYYY-MM-DD');
		    } else if(moment(formatedData.loaded_date, 'DD-MM-YYYY').isValid()) {
		        formatedData.loaded_date = moment(formatedData.loaded_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
		    }
	    }
	    if(formatedData.container_number || formatedData.loaded_date) {
	        apiFactory.bt.saveContainerNumber(formatedData).then(function(retData) {
	           console.log(retData);
	           clearForm();
	           toaster.success('Data updated Successfully');
	        });
	    } else {
	        alert('Please enter a valid data');
	        return false;
	    }
	}
    
}]);
