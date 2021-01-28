app.controller('updateData1Controller', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory',  
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory){
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';


	var clearForm = function () {
		$scope.bulkForm = {
		    container_number: { dispText: 'Container Number', value: '', error: '', validPattern: '', show: false},
			port_id: { dispText: 'Port', value: '', error: '', validPattern: '', show: true},
			loaded_date: {dispText: 'Loaded Date',value: '',error: '',validPattern: '',show: true},
			forwarder_id: {dispText: 'Forwarder',value: '',error: '',validPattern: '',show: true},
			sailed_from_kuwait_date: {dispText: 'Sailed from Kuwait Date',value: '',error: '',validPattern: '',show: true},
			container_destination_arrival_date: {dispText: 'Container Destination Arrival Date',value: '',error: '',validPattern: '',show: true},
			arrived_at_philipines_date: {dispText: 'Arrived at Philipines Date',value: '',error: '',validPattern: '',show: true}
		};
	}
	clearForm();
	
	$scope.onClearForm = function () {
		clearForm();
	}
  $scope.openedLoaded = false;
  $scope.openedSailed = false;
  $scope.openedDestArrival = false;
  $scope.openedPhiArrival = false;
  
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

  $scope.openSailed = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedSailed = true;
  };

  $scope.openDestArrival = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedDestArrival = true;
  };

  $scope.openPhiArrival = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedPhiArrival = true;
  };
  
  
    $scope.dropdowns = {
        arrPorts: [],
        arrForwarders: []
    };
	var getByPorts = function () {
		$scope.dropdowns.arrPorts = [];
		apiFactory.master
			.getByCategory({ category: 'p' })
			.then(function (retData) {
				if(retData.status == 200) {
					$scope.dropdowns.arrPorts = retData.data || [];
					$('#select_port').select2();
				} else {
					$scope.dropdowns.arrPorts = [];
					$('#select_port').select2();
				}
			}, function(retData) {
				if(retData.status == 403) {
					$state.go('signin');
				}
			});
	}
	getByPorts();

	var getByForwarders = function () {
		$scope.dropdowns.arrForwarders = [];
		apiFactory.master
			.getByCategory({ category: 'f' })
			.then(function (retData) {
				if(retData.status == 200) {
					$scope.dropdowns.arrForwarders = retData.data || [];
				} else {
					$scope.dropdowns.arrForwarders = [];
				}
			}, function(retData) {
				if(retData.status == 403) {
					$state.go('signin');
				}
			});
	}
	getByForwarders();
	$scope.arrContainers = [];
	var getAllContainers = function () {
	    apiFactory.bt.getAllNotUpdatedContainers()
			.then(function (retData) {
				if(retData.status == 200) {
					$scope.arrContainers = retData.data || [];
				} else {
					$scope.arrContainers = [];
				}
			}, function(retData) {
				$scope.arrContainers = [];
			});
	}
	getAllContainers();
	$scope.arrContainerInvoices = [];
	$scope.getInvoicesByContainerNumber = function (argRef) {
	    $scope.bulkForm.container_number.value = argRef.container_number;
	    $scope.arrContainerInvoices = [];
	    apiFactory.bt.getInvoicesByContainerNumber(argRef.container_number)
			.then(function (retData) {
				if(retData.status == 200) {
					$scope.arrContainerInvoices = retData.data || [];
					
        			$scope.bulkForm.port_id.value = retData.data[0].port_id * 1;
					setTimeout(function() {
						$('#select_port').select2('destroy');
						$('#select_port').select2();
					}, 1000);
        			$scope.bulkForm.container_number.value = retData.data[0].container_number;
        			$scope.bulkForm.forwarder_id.value = retData.data[0].forwarder_id * 1;
        			console.log(retData.data[0].loaded_date);
        			if(moment(retData.data[0].loaded_date, 'YYYY-MM-DD', true).isValid()) {
				        $scope.bulkForm.loaded_date.value = moment(retData.data[0].loaded_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
				    }
        			if(moment(retData.data[0].sailed_from_kuwait_date, 'YYYY-MM-DD', true).isValid()) {
				        $scope.bulkForm.sailed_from_kuwait_date.value = moment(retData.data[0].sailed_from_kuwait_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
				    }
        			if(moment(retData.data[0].container_destination_arrival_date, 'YYYY-MM-DD', true).isValid()) {
				        $scope.bulkForm.container_destination_arrival_date.value = moment(retData.data[0].container_destination_arrival_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
				    }
        			if(moment(retData.data[0].arrived_at_philipines_date, 'YYYY-MM-DD', true).isValid()) {
				        $scope.bulkForm.arrived_at_philipines_date.value = moment(retData.data[0].arrived_at_philipines_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
				    }
				} else {
					$scope.arrContainerInvoices = [];
				}
			}, function(retData) {
				$scope.arrContainerInvoices = [];
			});
	}
	
	$scope.onClickSave = function () {
	    var formatedData = {};
	    angular.forEach(Object.keys($scope.bulkForm), function(v, i){
	       formatedData[v] = $scope.bulkForm[v].value;
	    });
	    
		if(!!formatedData.loaded_date) {
		    if(moment.isDate(formatedData.loaded_date)) {
		        formatedData.loaded_date = moment(formatedData.loaded_date).format('YYYY-MM-DD');
		    } else if(moment(formatedData.loaded_date, 'DD-MM-YYYY').isValid()) {
		        formatedData.loaded_date = moment(formatedData.loaded_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
		    }
	    }
	    
		if(!!formatedData.sailed_from_kuwait_date) {
		    if(moment.isDate(formatedData.sailed_from_kuwait_date)) {
		        formatedData.sailed_from_kuwait_date = moment(formatedData.sailed_from_kuwait_date).format('YYYY-MM-DD');
		    } else if(moment(formatedData.sailed_from_kuwait_date, 'DD-MM-YYYY').isValid()) {
		        formatedData.sailed_from_kuwait_date = moment(formatedData.sailed_from_kuwait_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
		    }
	    }
	    
		if(!!formatedData.container_destination_arrival_date) {
		    if(moment.isDate(formatedData.container_destination_arrival_date)) {
		        formatedData.container_destination_arrival_date = moment(formatedData.container_destination_arrival_date).format('YYYY-MM-DD');
		    } else if(moment(formatedData.container_destination_arrival_date, 'DD-MM-YYYY').isValid()) {
		        formatedData.container_destination_arrival_date = moment(formatedData.container_destination_arrival_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
		    }
	    }
	    
		if(!!formatedData.arrived_at_philipines_date) {
		    if(moment.isDate(formatedData.arrived_at_philipines_date)) {
		        formatedData.arrived_at_philipines_date = moment(formatedData.arrived_at_philipines_date).format('YYYY-MM-DD');
		    } else if(moment(formatedData.arrived_at_philipines_date, 'DD-MM-YYYY').isValid()) {
		        formatedData.arrived_at_philipines_date = moment(formatedData.arrived_at_philipines_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
		    }
	    }
	    
	    apiFactory.bt.updateSailed(formatedData)
			.then(function (retData) {
				if(retData.status == 200) {
				    getAllContainers();
				    clearForm();
					$scope.arrContainerInvoices = [];
				} else {
				}
			}, function(retData) {
				
			});
	}
}]);
