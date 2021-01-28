app.controller('shippingLineForwarderController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory', '$localStorage', '$filter', '$timeout', 'Upload', 'appConstants', 
function($scope, 	$rootScope, $state, toaster, frontEndData, apiFactory, formFactory, $localStorage, $filter, $timeout, Upload, appConstants){ 
	
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';
	var editingInvoices = {};

	var clearFilter = function () {
		$scope.filters = {
			forwarder_id: '',
			paid_status: ''
		};
	}

	$scope.dropdowns = {};
	$scope.dropdowns.arrManifest = [
		{ id: 'UNFINISHED', item_name: 'Unfinished' },
		{ id: 'FINISHED', item_name: 'Finished' }
	];
	$scope.dropdowns.arrTelex = [
		{ id: 'UNFINISHED', item_name: 'Unfinished' },
		{ id: 'FINISHED', item_name: 'Finished' }
	];
	$scope.dropdowns.arrReleaseStatus = [
		{ id: 'NOT_RELEASED', item_name: 'Not Released' },
		{ id: 'RELEASED', item_name: 'Released' },
		{ id: 'IN_PROGRESS', item_name: 'In Progress' },
	];
	$scope.dropdowns.arrCurrency = [
		{ id: 'KD', item_name: 'KD' },
		{ id: 'PESO', item_name: 'PESO' },
	];
	$scope.dropdowns.arrForwarders = [];
	$scope.dropdowns.arrPaidStatus = [
		{ id:  ''}
	];

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 0,
    class: 'datepicker', 
    showWeeks: false, 
    showButtonBar: false
  };
  $scope.openedETA = false;
  $scope.openedLoaded = false;

  $scope.openETA = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedETA = true;
  };

  $scope.openLoaded = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    argRef.openedLoaded = true;
  };

  $scope.onChangeLoadedDate = function() {
  	var ld = moment($scope.mainForm.loaded_date.value, 'DD-MM-YYYY');
  	var ed = moment($scope.mainForm.estimated_arrival_date.value);
  	$scope.mainForm.duration.value = ed.diff(ld, 'days');
  };

  $scope.onChangeETA = function() {
  	var ld = moment($scope.mainForm.loaded_date.value, 'DD-MM-YYYY');
  	var ed = moment($scope.mainForm.estimated_arrival_date.value);
  	$scope.mainForm.duration.value = ed.diff(ld, 'days');
  };

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

  // $scope.$watch(['mainForm.loaded_date', 'mainForm.estimated_arrival_date'], function(){
  // 	// $scope.mainForm.duration.value = moment()
  // }, true);


  var clearDetailForm = function () {
	  $scope.detailForm = [];
	}

	var clearForm = function () {
		$scope.show_section = 'FORM';
		$scope.mainForm = {
			// id: { value: '', error: '', validPattern: ''},
			container_number: {dispText: 'Container Number',value: '',error: '',validPattern: 'required',show: true },
			billing_number: { value: '', error: '', validPattern: '', show: true },
			destination_id: { dispText: 'Destination', value: '', error: '', validPattern: '', show: true },
			destination_name: { value: '', error: '', validPattern: '', show: true },
			loaded_date: { value: '', error: '', validPattern: '', show: true },
			estimated_arrival_date: { value: '', error: '', validPattern: '', show: true },
			duration: { value: '', error: '', validPattern: '', show: true },
			manifest: { value: '', error: '', validPattern: '', show: true },
			manifest_data: { value: '', error: '', validPattern: '', show: true },
			telex: { value: '', error: '', validPattern: '', show: true },
			telex_data: { value: '', error: '', validPattern: '', show: true },
			release_status: { value: '', error: '', validPattern: '', show: true },
			release_status_data: { value: '', error: '', validPattern: '', show: true },
			forwarder_id: {dispText: 'Forwarder',value: '',error: '',validPattern: '',show: true },
			forwarder_name: {value: '',error: '',validPattern: '', show: true},
			forwarder_amount: {value: '',error: '',validPattern: '', show: true},
			forwarder_currency: {value: '',error: '',validPattern: '', show: true},
			forwarder_upload_file: {dispText: 'Upload File',value: '',error: '',validPattern: '',show: true},
			shipping_line_name: { value: '', error: '', validPattern: '', show: true },
			shipping_line_amount: { value: '', error: '', validPattern: '', show: true },
			shipping_line_currency: { value: '', error: '', validPattern: '', show: true },
			shipping_line_upload_file: {dispText: 'Upload File',value: '',error: '',validPattern: '',show: true},
			releasing_company: { value: '', error: '', validPattern: '', show: true },
			releasing_company_amount: { value: '', error: '', validPattern: '', show: true },
			releasing_company_currency: { value: '', error: '', validPattern: '', show: true },
			releasing_company_upload_file: {dispText: 'Upload File',value: '',error: '',validPattern: '',show: true},
			notes: { dispText: 'Notes', value: '', error: '', validPattern: '', show: true },
		};
		clearFilter();
	}
	clearForm();

	var setContainerDetails = function (argValueObj) {
		angular.forEach(Object.keys(argValueObj), function(v, i) {
			if($scope.mainForm[v]) {
				$scope.mainForm[v].value = argValueObj[v] && argValueObj[v] != null ? argValueObj[v] : '';
				if(v=='destination_id') {
					$scope.mainForm[v].value = argValueObj[v] * 1;
					$scope.mainForm['destination_name'].value = argValueObj['destination_id'] ? argValueObj['destination_data']['name'] : '';
				} else if(v=='forwarder_id') {
					$scope.mainForm[v].value = argValueObj[v] * 1;
					$scope.mainForm['forwarder_name'].value = argValueObj['forwarder_data']['name'];
				} else if(['loaded_date', 'estimated_arrival_date'].indexOf(v) >= 0) {
		      if(!!argValueObj[v]) {
			      if(moment(argValueObj[v], 'YYYY-MM-DD', true).isValid()) {
			        $scope.mainForm[v].value = moment(argValueObj[v], 'YYYY-MM-DD').format('DD-MM-YYYY');
			      } else {
				    	$scope.mainForm[v].value = '';
				    }
			    }
				}
			}
		});
	}

	$scope.clearState = function () {
		clearForm();
	}

	$scope.onBlurContainerNumber = function () { // Pending
		if($scope.mainForm.container_number.value) {

			apiFactory.bt.getContainerDetails({
				container_number: $scope.mainForm.container_number.value
			}).then(function(retData) {
				if(retData.status === 200) {
					if(!retData.data || !retData.data.length) {
						toaster.error('Invalid Container Number');
					} else {
						setContainerDetails(retData.data[0])
					}
				} else {
					toaster.error('Invalid Container Number');
				}
			}, function(retData) {
				if(retData.status == 403) {
					$state.go('signin');
				}
			});
		}
	}

  if(!!$rootScope.stateParams.id) { // Pending
		apiFactory.bt
			.getByInvoiceNumber($rootScope.stateParams.id)
			.then(function(retData) {
				if(retData.status === 200) {
					// formatBackForForm(retData.data[0]);
					formatBackForMaster(retData.data);
					formatBackForDetail(retData.data.detail);
					// $scope.tableData = retData.data || [];
				} else {
					// $scope.tableData = [];
				}
			}, function(retData) {
				if(retData.status == 403) {
					$state.go('signin');
				}
			});
  }

	var clearErrors = function () {
		// $scope.mainForm.category.error = '';
		// $scope.mainForm.item_name.error = '';
		// $scope.mainForm.description.error = '';
		// $scope.mainForm.id.error = '';
	}

	var formatFormData = function () {
		var temp = {};
		angular.forEach(Object.keys($scope.mainForm), function(v, i) {
			temp[v] = angular.copy($scope.mainForm[v].value);
		});
		return temp;
	}

	$scope.onChangeManifest = function (argRef) {
		var currentSelected = $filter('filter')($scope.dropdowns.arrManifest, {id: argRef.manifest.value})[0];
		argRef.manifest_data.value = currentSelected.item_name || '';
	}

	$scope.onChangeTelex = function (argRef) {
		var currentSelected = $filter('filter')($scope.dropdowns.arrTelex, {id: argRef.telex.value})[0];
		argRef.telex_data.value = currentSelected.item_name || '';
	}

	$scope.onChangeReleaseStatus = function (argRef) {
		var currentSelected = $filter('filter')($scope.dropdowns.arrReleaseStatus, {id: argRef.release_status.value})[0];
		argRef.release_status_data.value = currentSelected.item_name || '';
	}

	$scope.askForConfirm = function () {
		clearErrors();
		console.log($scope.mainForm);
    if (formFactory.validateFields($scope.mainForm)) {
    	$scope.show_section = 'PREVIEW';
    }
	}

	$scope.goBackToEdit = function () {
  	$scope.show_section = 'FORM';
	}

	var actualSumbit = function () {
		// console.log($scope.mainForm)
    if (formFactory.validateFields($scope.mainForm)) {
      let formattedData = formFactory.formatFormDataForApi($scope.mainForm);
      if(!!formattedData.loaded_date) {
	      if(moment(formattedData.loaded_date, 'DD-MM-YYYY', true).isValid()) {
	        formattedData.loaded_date = moment(formattedData.loaded_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
	      } else if(moment(formattedData.loaded_date, 'YYYY-MM-DD', true).isValid()) {
	        formattedData.loaded_date = moment(formattedData.loaded_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
	      } else {
	        formattedData.loaded_date = moment(formattedData.loaded_date).format('YYYY-MM-DD');
	      }
	    }
      if(!!formattedData.estimated_arrival_date) {
	      if(moment(formattedData.estimated_arrival_date, 'DD-MM-YYYY', true).isValid()) {
	        formattedData.estimated_arrival_date = moment(formattedData.estimated_arrival_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
	      } else if(moment(formattedData.estimated_arrival_date, 'YYYY-MM-DD', true).isValid()) {
	        formattedData.estimated_arrival_date = moment(formattedData.estimated_arrival_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
	      } else {
	        formattedData.estimated_arrival_date = moment(formattedData.estimated_arrival_date).format('YYYY-MM-DD');
	      }
	    }
	    formattedData.action = $rootScope.stateParams.t == 'n' ? 'ADD' : 'EDIT';

      Upload.upload({
        url: appConstants.apiUrlBase + 'slf',
        data: formattedData 
	    }).then(function (resp) {
				if(resp.status === 200) {
					toaster.success('Data Saved Successfully');
					$timeout(function() {
						if($rootScope.stateParams.t == 'n') {
							$state.reload();
						} else {
							$state.go('app.boxTracking');
						}
					}, 500);
					// clearForm();
				} else {
					toaster.error('Error in submitting the form. Please try again after some time.');
				}
	    // 	if(resp.data.error.code === 0 || resp.data.error.code === 200) {
	    // 		toaster.success('Successfully uploaded');
	    // 		blockUI.stop();
	    // 		$timeout(function() {
					// 	$state.reload();
					// }, 1000);
	    // 	} else {
	    // 		var msg = resp.data.error.msg || 'Error while uploading. Please try again later';
	    // 		toaster.error(msg);
		  	// 	blockUI.stop();
	    // 	}
	        // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
	    }, function (resp) {
				if(resp.status == 403) {
					$state.go('signin');
				} else {
					toaster.error('Error in submitting the form. Please try again after some time.');
	    		// var msg = resp.data.error.msg || 'Error while uploading. Please try again later';
	    		// toaster.error(msg);
	    		// blockUI.stop();
	        // console.log('Error status: ' + resp.status);
	      }
	    }, function (evt) {
	        // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	    });
		} else {
			toaster.error('Please submit a valid form.');
		}
	}

	$scope.submitForm = function () {
		clearErrors();

		apiFactory.bt.getContainerDetails({
			container_number: $scope.mainForm.container_number.value
		}).then(function(retData) {
			if(retData.status === 200) {
					if(!retData.data || !retData.data.length) {
					toaster.error('Invalid Container Number');
					$('#container_number').focus();
				} else {
					actualSumbit();
				}
			} else {
				toaster.error('Facing issues in saving the data. Please try again later.');
			}
		}, function(retData) {
			if(retData.status == 403) {
				$state.go('signin');
			}
		});
	}

}]);
