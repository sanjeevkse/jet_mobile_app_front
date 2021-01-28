app.controller('newBoxTrackingController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory', '$localStorage', '$filter', '$timeout', 'Upload', 'appConstants', 
function($scope, 	$rootScope, $state, toaster, frontEndData, apiFactory, formFactory, $localStorage, $filter, $timeout, Upload, appConstants){ 
	
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';
	var editingInvoices = {};

	var clearFilter = function () {
		$scope.filters = {
			category: '',
			item_name: '',
			description: ''
		};
	}

	$scope.dropdowns = {};
	$scope.dropdowns.arrBoxStatus = [];
	$scope.dropdowns.arrCoLoaders = [];
	$scope.dropdowns.arrDestinations = [];
	$scope.dropdowns.arrPorts = [];
	$scope.dropdowns.arrPackageTypes = [];
	$scope.dropdowns.arrSalesAgents = [];
	$scope.dropdowns.arrDrivers = [];
	$scope.dropdowns.arrSuppliers = [];
	$scope.dropdowns.arrForwarders = [];

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 0,
    class: 'datepicker', 
    showWeeks: false, 
    showButtonBar: false
  };
  $scope.dateOptionsMaxYesterday = {
    formatYear: 'yyyy',
    maxDate: moment(),
    startingDay: 0,
    class: 'datepicker', 
    showWeeks: false, 
    showButtonBar: false
  };
  $scope.openedPickup = false;
  $scope.openedLoaded = false;
  $scope.openedReminder = false;
  $scope.openedDestArrival = false;

  $scope.openPickup = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedPickup = true;
  };

  $scope.openLoaded = function($event, argRef) {
    $event.preventDefault();
    $event.stopPropagation();

    argRef.openedLoaded = true;
  };

  $scope.openReminder = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedReminder = true;
  };

  $scope.openDestArrival = function($event, argRef) {
    $event.preventDefault();
    $event.stopPropagation();

    argRef.openedDestArrival = true;
  };

  var clearDetailForm = function () {
	  $scope.detailForm = [];
	}

  var getDetailFormSkeleton = function () {
		return {
			id: {value: '',error: '',validPattern: ''},
			box_unique_number: {dispText: 'Quantity', value: '',error: '',validPattern: '',show: true},
			original_box_unique_number: {value: '',error: '',validPattern: ''},
			quantity: {dispText: 'Quantity', value: 1,error: '',validPattern: ''},
			box_status_id: {dispText: 'Box Status',value: '',error: '',validPattern: '',show: true},
			box_status_name: {value: '',error: '',validPattern: ''},
			box_length: {dispText: 'Box Length',value: '',error: '',validPattern: '',show: true},
			box_breadth: {dispText: 'Box Width',value: '',error: '',validPattern: '',show: true},
			box_height: {dispText: 'Box Height',value: '',error: '',validPattern: '',show: true},
			cbm: {dispText: 'CBM',value: '',error: '',validPattern: '',show: true},
			is_box_descrapency: { dispText: 'Box Descrapency', value: '', error: '', validPattern: '', show: true},
			package_type_id: { dispText: 'Package Type', value: '', error: '', validPattern: '', show: true},
			package_type_name: { value: '', error: '', validPattern: ''},
			loaded_date: {dispText: 'Loaded Date',value: '',error: '',validPattern: '',show: true},
			tracking_number: {dispText: 'Tracking Number',value: '',error: '',validPattern: '',show: true},
			container_number: {dispText: 'Container Number',value: '',error: '',validPattern: '',show: true},
			forwarder_id: {dispText: 'Forwarder',value: '',error: '',validPattern: '',show: true},
			forwarder_name: {value: '',error: '',validPattern: ''},
			container_destination_arrival_date: {dispText: 'Container Destination Arrival Date',value: '',error: '',validPattern: '',show: true},
			notes: {dispText: 'Notes',value: '',error: '',validPattern: '',show: true},
			upload_file: {dispText: 'Upload File',value: '',error: '',validPattern: '',show: true},
			file_path_json: {dispText: 'Uploaded Files',value: '',error: '',validPattern: '',show: true},
		};
  }

	var reassignBoxTrackingLocalStorage = function (argKey='', argValue='') {
    if (angular.isDefined($localStorage.boxTrackingVisibleFields) && $localStorage.boxTrackingVisibleFields!='' && $localStorage.boxTrackingVisibleFields!={}) {
      $scope.boxTrackingVisibleFields = $localStorage.boxTrackingVisibleFields;
    } else {
    	$scope.boxTrackingVisibleFields = {};
    	$localStorage.boxTrackingVisibleFields = {};
	    angular.forEach(Object.keys($scope.mainForm), function(v, i) {
	    	$scope.boxTrackingVisibleFields[v] = angular.copy($scope.mainForm[v].show);
	    });
	    angular.forEach(Object.keys($scope.detailForm[0]), function(v, i) {
	    	$scope.boxTrackingVisibleFields[v] = angular.copy($scope.detailForm[0][v].show);
	    });
	  	$localStorage.boxTrackingVisibleFields = $scope.boxTrackingVisibleFields;
    }
    if(!!argKey) {
	  	$scope.boxTrackingVisibleFields[argKey] = angular.copy(argValue.show);
	  	$localStorage.boxTrackingVisibleFields = $scope.boxTrackingVisibleFields;
    }
    angular.forEach(Object.keys($scope.boxTrackingVisibleFields), function(v, i) {
    	// console.log($scope.mainForm, v);
    	if($scope.mainForm[v]) {
	    	$scope.mainForm[v].show = angular.copy($scope.boxTrackingVisibleFields[v]);
	    }

	    angular.forEach($scope.detailForm, function(v1, i1) {
	    	if(v1[v]) {
		    	$scope.detailForm[i1][v].show = angular.copy($scope.boxTrackingVisibleFields[v]);
		    }
		  });
    });
	}

  var pushDetailForm = function () {
    if($scope.detailForm.length) {
      	lastIndex = $scope.detailForm[$scope.detailForm.length - 1].box_unique_number.value;
      	$scope.detailForm.push(getDetailFormSkeleton());
      	$scope.detailForm[lastIndex].box_unique_number.value = lastIndex * 1 + 1
    		reassignBoxTrackingLocalStorage('', '');   
    } else {
      	lastIndex = 0;
      	$scope.detailForm.push(getDetailFormSkeleton());
      	$scope.detailForm[lastIndex].box_unique_number.value = lastIndex * 1 + 1
    		reassignBoxTrackingLocalStorage('', '');
    }
  }

	var clearForm = function () {
		$scope.show_section = 'FORM';
		$scope.mainForm = {
			// id: { value: '', error: '', validPattern: ''},
			firm_id: { value: $localStorage.selectedFirm ? $localStorage.selectedFirm.id : '', error: '', validPattern: 'required'},
			co_loader_id: { value: null, error: '', validPattern: ''},
			pick_up_date: { value: '', error: '', validPattern: 'required'},
			consignee_name: { dispText: 'Consignee Name', value: '', error: '', validPattern: '', show: true},
			consignee_address: { dispText: 'Consignee Address', value: '', error: '', validPattern: '', show: true},
			consignee_phone_number: { dispText: 'Consignee Phone Number', value: '', error: '', validPattern: '', show: true},
			destination_id: { dispText: 'Destination', value: '', error: '', validPattern: '', show: true},
			destination_name: { value: '', error: '', validPattern: ''},
			port_id: { dispText: 'Port', value: '', error: '', validPattern: '', show: true},
			port_name: { value: '', error: '', validPattern: ''},
			supplier_name: { dispText: 'Shipper Name', value: '', error: '', validPattern: '', show: true},
			supplier_address: { dispText: 'Shipper Address', value: '', error: '', validPattern: '', show: true},
			supplier_phone_number: { dispText: 'Shipper Phone Number', value: '', error: '', validPattern: '', show: true},
			sales_agent_id: { dispText: 'Sales Agent', value: '', error: '', validPattern: '', show: true},
			sales_agent_name: { value: '', error: '', validPattern: ''},
			driver_id: { dispText: 'Driver', value: '', error: '', validPattern: '', show: true},
			driver_name: { value: '', error: '', validPattern: ''},
			invoice_number: { value: '', error: '', validPattern: 'required'},
			cash_amount: { value: '', error: '', validPattern: ''},
			credit_amount: { value: '', error: '', validPattern: ''},
			invoice_total_amount: { value: '', error: '', validPattern: 'required'},
			next_payment_reminder: {dispText: 'Reminder Date',value: '',error: '',validPattern: '',show: true},
			receipt_number: {dispText: 'Receipt Number',value: '',error: '',validPattern: '',show: true},
			// notes: { dispText: 'Notes', value: '', error: '', validPattern: '', show: true},
		};
		clearFilter();
		clearDetailForm();
		pushDetailForm();
	}
	clearForm();
  
  $rootScope.onChangeCompany = function () {
    angular.forEach($scope.arrFirms, function(v, i) {
      if(v.id == $scope.mainForm.firm_id.value) {
        $localStorage.selectedFirm = v;
        $scope.mainForm.firm_id.value = $localStorage.selectedFirm; 
        $rootScope.selectedFirm = $localStorage.selectedFirm;
      }
    });
    $timeout(function() {
      location.reload();
    }, 200);
  }

  // $scope.$watch('$localStorage.selectedFirm', function(){
  //   $rootScope.selectedFirm = $localStorage.selectedFirm;
  //   console.log($rootScope.selectedFirm);
  // }, true);

  apiFactory.firm.getAll().then(function(retData) {
    $scope.arrFirms = retData.data || []; 
    if(!$localStorage.selectedFirm) {
      $localStorage.selectedFirm = $scope.arrFirms[0];
    }
    $scope.mainForm.firm_id.value = $localStorage.selectedFirm.id;
    $rootScope.selectedFirm = $localStorage.selectedFirm;
  });

	// var formatBackForForm = function (argValueObj) {
	// 	var count = 0;
	// 	angular.forEach(Object.keys(argValueObj), function(v, i) {
	// 		if($scope.mainForm[v] && v!='detail') {
	// 			$scope.mainForm[v].value = argValueObj[v];
	// 			if(v=='destination_id') {
	// 				setTimeout(function() {
	// 					$('#select_destination').select2('destroy');
	// 					$('#select_destination').select2();
	// 				}, 1000);
	// 			} else if(v=='port_id') {
	// 				setTimeout(function() {
	// 					$('#select_port').select2('destroy');
	// 					$('#select_port').select2();
	// 				}, 1000);
	// 			} else if(v=='sales_agent_id') {
	// 				$scope.mainForm[v].value = argValueObj[v] * 1;
	// 				setTimeout(function() {
	// 					$('#select_sales_agent').select2('destroy');
	// 					$('#select_sales_agent').select2();
	// 				}, 1000);
	// 			} else if(v=='driver_id') {
	// 				$scope.mainForm[v].value = argValueObj[v] * 1;
	// 				setTimeout(function() {
	// 					$('#select_driver').select2('destroy');
	// 					$('#select_driver').select2();
	// 				}, 1000);
	// 			}
	// 		} else {
	// 			if(v=='destination_data') {
	// 				$scope.mainForm['destination_name'].value = argValueObj[v].name;
	// 			} else if(v=='port_data') {
	// 				$scope.mainForm['port_name'].value = argValueObj[v].name;
	// 			} else if(v=='sales_agent_data') {
	// 				$scope.mainForm['sales_agent_name'].value = argValueObj[v].name;
	// 			} else if(v=='driver_data') {
	// 				$scope.mainForm['driver_name'].value = argValueObj[v].name;
	// 			}
	// 		}
	// 	});
	// }

	var formatBackForMaster = function (argValueObj) {
		angular.forEach(Object.keys(argValueObj), function(v, i) {
			if($scope.mainForm[v] && v!='detail') {
				$scope.mainForm[v].value = argValueObj[v] && argValueObj[v] != null ? argValueObj[v] : '';
				if(v=='destination_id') {
					$scope.mainForm[v].value = argValueObj[v] * 1;
					setTimeout(function() {
						$('#select_destination').select2('destroy');
						$('#select_destination').select2();
					}, 1000);
				} else if(v=='port_id') {
					$scope.mainForm[v].value = argValueObj[v] * 1;
					setTimeout(function() {
						$('#select_port').select2('destroy');
						$('#select_port').select2();
					}, 1000);
				} else if(v=='sales_agent_id') {
					$scope.mainForm[v].value = argValueObj[v] * 1;
					setTimeout(function() {
						$('#select_sales_agent').select2('destroy');
						$('#select_sales_agent').select2();
					}, 1000);
				} else if(v=='driver_id') {
					$scope.mainForm[v].value = argValueObj[v] * 1;
					setTimeout(function() {
						$('#select_driver').select2('destroy');
						$('#select_driver').select2();
					}, 1000);
				} else if(v=='firm_id') {
					$scope.mainForm[v].value = argValueObj[v] * 1;
				} else if(['pick_up_date', 'next_payment_reminder'].indexOf(v) >= 0) {
		      if(!!argValueObj[v]) {
			      if(moment(argValueObj[v], 'YYYY-MM-DD', true).isValid()) {
			        $scope.mainForm[v].value = moment(argValueObj[v], 'YYYY-MM-DD').format('DD-MM-YYYY');
			      } else {
				    	$scope.mainForm[v].value = '';
				    }
			    }
				}
			} else {
				if(v=='destination_data') {
					$scope.mainForm['destination_name'].value = argValueObj[v].name;
				} else if(v=='port_data') {
					$scope.mainForm['port_name'].value = argValueObj[v].name;
				} else if(v=='sales_agent_data') {
					$scope.mainForm['sales_agent_name'].value = argValueObj[v].name;
				} else if(v=='driver_data') {
					$scope.mainForm['driver_name'].value = argValueObj[v].name;
				}
			}
		});
	}

	var formatBackForDetail = function (argValueArr) {
		angular.forEach(argValueArr, function(v, i) {
			$scope.detailForm[i] = getDetailFormSkeleton();
			angular.forEach(Object.keys(v), function(v1, i1) {
				editingInvoices[argValueArr[i]['id']] = argValueArr[i]['id'];
				if($scope.detailForm[i][v1]) {
					if(v1=='package_type_id') {
						$scope.detailForm[i][v1].value = argValueArr[i][v1] * 1;
					} else if(['loaded_date', 'container_destination_arrival_date'].indexOf(v) >= 0) {
			      if(!!argValueArr[v]) {
				      if(moment(argValueArr[v], 'YYYY-MM-DD', true).isValid()) {
				        $scope.detailForm[i][v1].value = moment(argValueArr[v], 'YYYY-MM-DD').format('DD-MM-YYYY');
				        $
				      }
				    } else {
				    	$scope.detailForm[i][v1].value = '';
				    }
					} else if (v1 == 'box_unique_number') {
						$scope.detailForm[i][v1].value = argValueArr[i][v1]
						$scope.detailForm[i]['original_box_unique_number'].value = argValueArr[i][v1]
					} else {
						$scope.detailForm[i][v1].value = argValueArr[i][v1] && argValueArr[i][v1] != null ? argValueArr[i][v1] : '';
					}
				} else {
					if(v1=='package_type_data') {
						$scope.detailForm[i]['package_type_name'].value = argValueArr[i][v1].name;
					} else if (v1 == 'box_status_data') {
						$scope.detailForm[i]['box_status_name'].value = argValueArr[i][v1].name;
					} else if (v1 == 'forwarder_data') {
						$scope.detailForm[i]['forwarder_name'].value = argValueArr[i][v1].name;
					}
				}
			});
		});
		// console.log($scope.detailForm);
	}

	var getByBoxStatus = function () {
		$scope.dropdowns.arrBoxStatus = [];
		apiFactory.master
			.getByCategory({ category: 'bs' })
			.then(function (retData) {
				$scope.dropdowns.arrBoxStatus = retData.data || [];
			});
	}
	getByBoxStatus();

	var getByCoLoaders = function () {
		$scope.dropdowns.arrCoLoaders = [];
		apiFactory.master
			.getByCategory({ category: 'co' })
			.then(function (retData) {
				$scope.dropdowns.arrCoLoaders = retData.data || [];
			});
	}
	getByCoLoaders();

	var getByDestinations = function () {
		$scope.dropdowns.arrDestinations = [];
		apiFactory.master
			.getByCategory({ category: 'd' })
			.then(function (retData) {
				$scope.dropdowns.arrDestinations = retData.data || [];
				$('#select_destination').select2();
			});
	}
	getByDestinations();

	var getByPorts = function () {
		$scope.dropdowns.arrPorts = [];
		apiFactory.master
			.getByCategory({ category: 'p' })
			.then(function (retData) {
				$scope.dropdowns.arrPorts = retData.data || [];
				$('#select_port').select2();
			});
	}
	getByPorts();

	var getByPackageTypes = function () {
		$scope.dropdowns.arrPackageTypes = [];
		apiFactory.master
			.getByCategory({ category: 'pt' })
			.then(function (retData) {
				$scope.dropdowns.arrPackageTypes = retData.data || [];
			});
	}
	getByPackageTypes();

	var getBySalesAgents = function () {
		$scope.dropdowns.arrSalesAgents = [];
		apiFactory.master
			.getUsersByCategory({ category: 'sa' })
			.then(function (retData) {
				$scope.dropdowns.arrSalesAgents = retData.data || [];
				$('#select_sales_agent').select2();
			});
	}
	getBySalesAgents();

	var getByDrivers = function () {
		$scope.dropdowns.arrDrivers = [];
		apiFactory.master
			.getUsersByCategory({ category: 'dr' })
			.then(function (retData) {
				$scope.dropdowns.arrDrivers = retData.data || [];
				$('#select_driver').select2();
			});
	}
	getByDrivers();

	// var getBySuppliers = function () {
	// 	$scope.dropdowns.arrSuppliers = [];
	// 	apiFactory.master
	// 		.getSupplier()
	// 		.then(function (retData) {
	// 			$scope.dropdowns.arrSuppliers = retData.data || [];
	// 		});
	// }
	// getBySuppliers();

	var getByForwarders = function () {
		$scope.dropdowns.arrForwarders = [];
		apiFactory.master
			.getByCategory({ category: 'f' })
			.then(function (retData) {
				$scope.dropdowns.arrForwarders = retData.data || [];
			});
	}
	getByForwarders();

	$scope.onChangeCalcTotalAmount = function () {
		$scope.mainForm.invoice_total_amount.value = ($scope.mainForm.cash_amount.value || 0)* 1 + ($scope.mainForm.credit_amount.value || 0) * 1;
	}

	$scope.addMoreBox = function () {
		pushDetailForm();
	}

	$scope.clearState = function () {
		clearForm();
	}

	$scope.onBlurInvoiceNumber = function () {
		if($scope.mainForm.invoice_number.value) {
			let ids = [];
			angular.forEach(Object.keys(editingInvoices), function(v, i) {
				ids.push(editingInvoices[v]);
			});

			angular.forEach($scope.detailForm, function(v, i) {
				// if(!v.original_box_unique_number) {
					$scope.detailForm[i].box_unique_number.value = i *1 + 1
				// }
			})

			apiFactory.bt.checkInvoiceNumber({
				invoice_number: $scope.mainForm.invoice_number.value,
				'notin': ids.join(',')
			}).then(function(retData) {
				if(retData.status === 200) {
					if(!retData.data || retData.data.length) {
						toaster.error('Invoice number already taken');
						// $('#invoice_number').focus();
					}
				} else {

				}
			}, function(retData) {
				if(retData.status == 403) {
					$state.go('signin');
				}
			});
		}
	}

  $scope.removeThisBox = function ($event, argIndex) {
    if($scope.detailForm.length) {
      $scope.detailForm.splice(argIndex, 1);
			angular.forEach($scope.detailForm, function(v, i) {
				// if(!v.original_box_unique_number) {
					$scope.detailForm[i].box_unique_number.value = i *1 + 1
				// }
			})
    }
  }

  // $scope.onChangeTotalQuantity = function () {

  // }

  if(!!$rootScope.stateParams.id) {
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

	$scope.calcCBM = function(argRef) {
		argRef.cbm.value = (argRef.box_length.value || 0) * (argRef.box_breadth.value || 0) * (argRef.box_height.value || 0);
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

	$scope.onChangeForwarder = function (argRef) {
		var currentSelected = $filter('filter')($scope.dropdowns.arrForwarders, {id: argRef.forwarder_id.value})[0];
		argRef.forwarder_name.value = currentSelected.item_name || '';
	}

	$scope.onChangeBoxStatus = function (argRef) {
		var currentSelected = $filter('filter')($scope.dropdowns.arrBoxStatus, {id: argRef.box_status_id.value})[0];
		argRef.box_status_name.value = currentSelected.item_name || '';
	}

	$scope.onChangeDestination = function () {
		var currentSelected = $filter('filter')($scope.dropdowns.arrDestinations, {id: $scope.mainForm.destination_id.value})[0];
		$scope.mainForm.destination_name.value = currentSelected.item_name || '';
	}

	$scope.onChangePort = function () {
		var currentSelected = $filter('filter')($scope.dropdowns.arrPorts, {id: $scope.mainForm.port_id.value})[0];
		$scope.mainForm.port_name.value = currentSelected.item_name || '';
	}

	$scope.onChangePackageType = function (argRef) {
		var currentSelected = $filter('filter')($scope.dropdowns.arrPackageTypes, {id: argRef.package_type_id.value})[0];
		argRef.package_type_name.value = currentSelected.item_name || '';
	}

	$scope.onChangeSalesAgent = function () {
		var currentSelected = $filter('filter')($scope.dropdowns.arrSalesAgents, {id: $scope.mainForm.sales_agent_id.value})[0];
		$scope.mainForm.sales_agent_name.value = currentSelected.full_name || '';
	}

	$scope.onChangeDriver = function () {
		var currentSelected = $filter('filter')($scope.dropdowns.arrDrivers, {id: $scope.mainForm.driver_id.value})[0];
		$scope.mainForm.driver_name.value = currentSelected.full_name || '';
	}

	$scope.onChangeField = function (argKey, argValue) {
		reassignBoxTrackingLocalStorage(argKey, argValue);
	}

	$scope.onChangeDetailField = function (argKey, argValue) {
		reassignBoxTrackingLocalStorage(argKey, argValue);
	}

	$scope.askForConfirm = function () {
		clearErrors();
    if (formFactory.validateFields($scope.mainForm)) {
    	$scope.show_section = 'PREVIEW';
    }
	}

	$scope.goBackToEdit = function () {
  	$scope.show_section = 'FORM';
	}

	var actualSumbit = function () {
    if (formFactory.validateFields($scope.mainForm)) {
      let formattedData = formFactory.formatFormDataForApi($scope.mainForm);
      if(!!formattedData.pick_up_date) {
	      if(moment(formattedData.pick_up_date, 'DD-MM-YYYY', true).isValid()) {
	        formattedData.pick_up_date = moment(formattedData.pick_up_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
	      } else if(moment(formattedData.pick_up_date, 'YYYY-MM-DD', true).isValid()) {
	        formattedData.pick_up_date = moment(formattedData.pick_up_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
	      } else {
	        formattedData.pick_up_date = moment(formattedData.pick_up_date).format('YYYY-MM-DD');
	      }
	    }
      if(!!formattedData.next_payment_reminder) {
	      if(moment(formattedData.next_payment_reminder, 'DD-MM-YYYY', true).isValid()) {
	        formattedData.next_payment_reminder = moment(formattedData.next_payment_reminder, 'DD-MM-YYYY').format('YYYY-MM-DD');
	      } else if(moment(formattedData.next_payment_reminder, 'YYYY-MM-DD', true).isValid()) {
	        formattedData.next_payment_reminder = moment(formattedData.next_payment_reminder, 'YYYY-MM-DD').format('YYYY-MM-DD');
	      } else {
	        formattedData.next_payment_reminder = moment(formattedData.next_payment_reminder).format('YYYY-MM-DD');
	      }
	    }
      var detail = [];
      angular.forEach($scope.detailForm, function(v, i) {
      	var temp = {};
      	if(formFactory.anyFieldFilled(v)) {
	    		temp = formFactory.formatFormDataForApi(v);
	    		// console.log(temp.loaded_date);
      		if(!!temp.loaded_date) {
      			// console.log(temp.loaded_date, moment(temp.loaded_date, 'DD-MM-YYYY', true).isValid());
			      if(moment(temp.loaded_date, 'DD-MM-YYYY', true).isValid()) {
			        temp.loaded_date = moment(temp.loaded_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
			      } else if(moment(temp.loaded_date, 'YYYY-MM-DD', true).isValid()) {
			        temp.loaded_date = moment(temp.loaded_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
			      } else {
			        temp.loaded_date = moment(temp.loaded_date).format('YYYY-MM-DD');
			      }
			    } 
			    if(!!temp.container_destination_arrival_date) {
			      if(moment(temp.container_destination_arrival_date, 'DD-MM-YYYY', true).isValid()) {
			        temp.container_destination_arrival_date = moment(temp.container_destination_arrival_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
			      } else if(moment(temp.container_destination_arrival_date, 'YYYY-MM-DD', true).isValid()) {
			        temp.container_destination_arrival_date = moment(temp.container_destination_arrival_date, 'YYYY-MM-DD').format('YYYY-MM-DD');

			      } else {
			        temp.container_destination_arrival_date = moment(temp.container_destination_arrival_date).format('YYYY-MM-DD');
			      }
			    }
			    if(temp.file_path_json && Array.isArray(temp.file_path_json)) {
				    temp.file_path_json = temp.file_path_json.join(',,,,,');
				  }
      		detail.push(temp);
      	}
      });
      formattedData.detail = detail;

	    formattedData.action = $rootScope.stateParams.t == 'n' ? 'ADD' : 'EDIT';

      Upload.upload({
        url: appConstants.apiUrlBase + 'bt',
        data: formattedData 
	    }).then(function (resp) {
				if(resp.status === 200) {
					toaster.success('Data Saved Successfully');
					$timeout(function() {
						if($rootScope.stateParams.t == 'n') {
							$state.reload();
						} else {
							$state.go('app.manifest2');
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
			// if($rootScope.stateParams.t == 'u') { // Update
			// 	console.log('update');
			// 	// return false;
			// 	apiFactory.bt
			// 		.update({
			// 			data: formattedData
			// 		})
			// 		.then(function(retData) {
			// 			if(retData.status === 200) {
			// 				toaster.success('Data Updated Successfully');
			// 				$timeout(function() {
			// 					$state.reload();
			// 				}, 500);
			// 			} else {
			// 				toaster.error('Error in submitting the form. Please try again after some time.');
			// 			}
			// 		});
			// } else { // Insert
			// 	console.log('insert');
			// 	// return false;
			// 	apiFactory.bt
			// 		.save({
			// 			data: formattedData
			// 		})
			// 		.then(function(retData) {
			// 			if(retData.status === 200) {
			// 				toaster.success('Data Saved Successfully');
			// 				$timeout(function() {
			// 					$state.reload();
			// 				}, 500);
			// 				// clearForm();
			// 			} else {
			// 				toaster.error('Error in submitting the form. Please try again after some time.');
			// 			}
			// 		});
			// }
		} else {
			toaster.error('Please submit a valid form.');
		}
	}

	$scope.submitForm = function () {
		clearErrors();

		let ids = [];
		angular.forEach(Object.keys(editingInvoices), function(v, i) {
			ids.push(editingInvoices[v]);
		});

		apiFactory.bt.checkInvoiceNumber({
			invoice_number: $scope.mainForm.invoice_number.value,
			'notin': ids.join(',')
		}).then(function(retData) {
			if(retData.status === 200) {
				if(!retData.data || retData.data.length) {
					toaster.error('Invoice number already taken');
					$('#invoice_number').focus();
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
