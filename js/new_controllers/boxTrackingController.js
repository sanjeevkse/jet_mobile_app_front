app.controller('boxTrackingController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'Upload', 'appConstants', '$state', 'blockUI', '$timeout', '$localStorage', 'formFactory', '$location',
function($scope, 	$rootScope, $state, toaster, frontEndData, apiFactory, Upload, appConstants, $state, blockUI, $timeout, $localStorage, formFactory, $location){ 
	
	$rootScope.stateParams = angular.copy($state.params);

	$scope.tableData = [];
	var table = '';
	$scope.checkboxesFirms = [];
  apiFactory.firm.getAll().then(function(retData) {
  	if(retData.status == 200) {
	    $scope.checkboxesFirms = retData.data || []; 
			angular.forEach($scope.checkboxesFirms, function(v, i) {
				$scope.checkboxesFirms[i].btSelected = true;
			});
		} else {
			$scope.checkboxesFirms = [];
		}
  }, function(retData) {
		if(retData.status == 403) {
			$state.go('signin');
		}
	});

	$scope.dateRangePickerOptions = {
		format: 'DD-MM-YYYY'
	};
	$scope.formats = 'dd-MM-yyyy';
  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 0,
    class: 'datepicker', 
    showWeeks: false
  };
  $scope.openedLoaded = false;
  $scope.openedDestArrival = false;

  $scope.openLoaded = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedLoaded = true;
  };

  $scope.openDestArrival = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedDestArrival = true;
  };
	$scope.dropdowns = {};
	$scope.dropdowns.arrPorts = [];
	$scope.dropdowns.arrForwarders = [];
	$scope.dropdowns.arrBoxesInWarehouse = [
		{id: 'INGORE', text: 'Ignore'},
		{id: 'YES', text: 'Yes'},
		{id: 'NO', text: 'No'},
	];
	$scope.dropdowns.arrIsBoxesDescrapency = [
		{id: 'INGORE', text: 'Ignore'},
		{id: 'YES', text: 'Yes'},
		{id: 'NO', text: 'No'},
	];

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

	var resetControllerData = function () {
		$scope.filters = {
			pick_up_date: '',
			loaded_date: '',
			container_destination_arrival_date: '',
			paid_status: '',
			port_id: '',
			forwarder_id: '',
			boxes_in_warehouse: 'INGORE',
			is_box_descrapency: 'INGORE',
		};
	}
	resetControllerData();

	var initDataTable = function () {
		if ( $.fn.dataTable.isDataTable( '#bt_table' ) ) {
		  // table.destroy();
		  $('#bt_table').DataTable().clear().destroy();
		}
		setTimeout(function() {
			table = $('#bt_table').DataTable({
				"fixedHeader": true,
				"destroy": true,
				"deferRender": true,
				"scrollX": true,
			  "scrollCollapse": false,
			  "paging": true,
			  info: true,
			  "fixedColumns": {
		      "leftColumns": 5
		    },
		    dom: 'Bfrtip',
		    buttons: [
            'colvis',
            {
	            text: "Export",
	            extend: "excelHtml5",
	            title: 'exported_'+moment().format('YYYY_MM_DD_HH_mm_ss'),
	            exportOptions: {
	            	columns: ':visible'
	            },
	            collectionLayout: 'fixed two-column'
		        }
        ],
        columnDefs: [
        	{ type: 'date-uk', targets: 2 },
        	{ type: 'date-uk', targets: 5 },
        	{ type: 'date-uk', targets: 8 },
        ],
        order: [[2, 'desc']]
			});

			// .page.len( 10 ).draw();
			// console.log(table.info());
		}, 200);
	}

	$scope.onClickFilterApply = function () {
		filterParams = angular.copy($scope.filters);
		if(!!filterParams.pick_up_date) {
			filterParams.pick_up_date = filterParams.pick_up_date.split(' - ');
	    if(moment(filterParams.pick_up_date[0], 'DD-MM-YYYY', true).isValid()) {
	      filterParams.pick_up_date[0] = moment(filterParams.pick_up_date[0], 'DD-MM-YYYY').format('YYYY-MM-DD');
	    } else {
	      filterParams.pick_up_date[0] = moment(filterParams.pick_up_date[0]).format('YYYY-MM-DD');
	    }
	    if(moment(filterParams.pick_up_date[1], 'DD-MM-YYYY', true).isValid()) {
	      filterParams.pick_up_date[1] = moment(filterParams.pick_up_date[1], 'DD-MM-YYYY').format('YYYY-MM-DD');
	    } else {
	      filterParams.pick_up_date[1] = moment(filterParams.pick_up_date[1]).format('YYYY-MM-DD');
	    }
	    filterParams.pick_up_date = filterParams.pick_up_date.join(' - ');
	  }

		if(!!filterParams.loaded_date) {
			filterParams.loaded_date = filterParams.loaded_date.split(' - ');
	    if(moment(filterParams.loaded_date[0], 'DD-MM-YYYY', true).isValid()) {
	      filterParams.loaded_date[0] = moment(filterParams.loaded_date[0], 'DD-MM-YYYY').format('YYYY-MM-DD');
	    } else {
	      filterParams.loaded_date[0] = moment(filterParams.loaded_date[0]).format('YYYY-MM-DD');
	    }
	    if(moment(filterParams.loaded_date[1], 'DD-MM-YYYY', true).isValid()) {
	      filterParams.loaded_date[1] = moment(filterParams.loaded_date[1], 'DD-MM-YYYY').format('YYYY-MM-DD');
	    } else {
	      filterParams.loaded_date[1] = moment(filterParams.loaded_date[1]).format('YYYY-MM-DD');
	    }
	    filterParams.loaded_date = filterParams.loaded_date.join(' - ');
    }

		if(!!filterParams.container_destination_arrival_date) {
			filterParams.container_destination_arrival_date = filterParams.container_destination_arrival_date.split(' - ');
	    if(moment(filterParams.container_destination_arrival_date[0], 'DD-MM-YYYY', true).isValid()) {
	      filterParams.container_destination_arrival_date[0] = moment(filterParams.container_destination_arrival_date[0], 'DD-MM-YYYY').format('YYYY-MM-DD');
	    } else {
	      filterParams.container_destination_arrival_date[0] = moment(filterParams.container_destination_arrival_date[0]).format('YYYY-MM-DD');
	    }
	    if(moment(filterParams.container_destination_arrival_date[1], 'DD-MM-YYYY', true).isValid()) {
	      filterParams.container_destination_arrival_date[1] = moment(filterParams.container_destination_arrival_date[1], 'DD-MM-YYYY').format('YYYY-MM-DD');
	    } else {
	      filterParams.container_destination_arrival_date[1] = moment(filterParams.container_destination_arrival_date[1]).format('YYYY-MM-DD');
	    }
	    filterParams.container_destination_arrival_date = filterParams.container_destination_arrival_date.join(' - ');
    }
    filterParams.firm_ids = [];
		angular.forEach($scope.checkboxesFirms, function(v, i) {
			if($scope.checkboxesFirms[i].btSelected) {
				filterParams.firm_ids.push(v.id);
			}
		});
    filterParams.firm_ids = filterParams.firm_ids.join(',');

		/* apiFactory.bt
			.getByFilters({
				data: filterParams
			})
			.then(function(retData) {
				if(retData.status === 200) {
					$scope.tableData = retData.data.data || [];
					// console.log($scope.tableData);
					// angular.forEach($scope.tableData, function(v, i) {
					// 	$scope.tableData[i].rowSelected = true;
					// });
					$scope.pagination = retData.data.pagination || [];
					initDataTable();
				} else {
					$scope.tableData = [];
					$scope.pagination = {};
				}
			}, function(retData) {
				if(retData.status == 403) {
					$state.go('signin');
				}
			}); */
	}
	$scope.onClickFilterApply();

	$scope.onClickAddBulk = function (argIndex, argRef) {
		if($('[data-refpid="'+argRef.id+'"]').hasClass('bulk_selected')) {
			toaster.warning('You have added it already.');
		} else {
			$scope.selectedRows.push(argRef);
			$('[data-refpid="'+argRef.id+'"]').addClass('bulk_selected');			
		}
	}
	$scope.onClickRemoveBulk = function (argIndex, argRef) {
		$scope.selectedRows.splice(argIndex, 1);
		$('[data-refpid="'+argRef.id+'"]').removeClass('bulk_selected');
	}

	var clearBulkForm = function () {
		$scope.selectedRows = [];
		$scope.bulkForm = {
			destination_id: { dispText: 'Destination', value: '', error: '', validPattern: '', show: true},
			port_id: { dispText: 'Port', value: '', error: '', validPattern: '', show: true},
			loaded_date: {dispText: 'Loaded Date',value: '',error: '',validPattern: '',show: true},
			container_number: {dispText: 'Contact Number',value: '',error: '',validPattern: 'required',show: true},
			forwarder_id: {dispText: 'Forwarder',value: '',error: '',validPattern: '',show: true},
			container_destination_arrival_date: {dispText: 'Container Destination Arrival Date',value: '',error: '',validPattern: '',show: true},
		};
	}
	clearBulkForm();

	$scope.uploadThisExcel = function () {
    if ($scope.uploadForm.import_this.$valid && $scope.import_this) {
      $scope.upload($scope.import_this);
    }
	}

	$scope.uploadThisExcelStatus = function () {
    if ($scope.uploadFormStatus.import_this_status.$valid && $scope.import_this_status) {
      $scope.uploadStatus($scope.import_this_status);
    }
	}

	$scope.uploadThisExcelMapBoxTracking = function () {
    if ($scope.uploadFormMapBoxTracking.import_this_map_box_tracking.$valid && $scope.import_this_map_box_tracking) {
      $scope.uploadMapBoxTracking($scope.import_this_map_box_tracking);
    }
	}

	$scope.onSubmitBulkForm = function () {
    if (formFactory.validateFields($scope.bulkForm)) {
      let formattedData = formFactory.formatFormDataForApi($scope.bulkForm);
    	
    	if(!!formattedData.loaded_date) {
  			// console.log(formattedData.loaded_date, moment(formattedData.loaded_date, 'DD-MM-YYYY', true).isValid());
	      if(moment(formattedData.loaded_date, 'DD-MM-YYYY', true).isValid()) {
	        formattedData.loaded_date = moment(formattedData.loaded_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
	      } else if(moment(formattedData.loaded_date, 'YYYY-MM-DD', true).isValid()) {
	        formattedData.loaded_date = moment(formattedData.loaded_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
	      } else {
	        formattedData.loaded_date = moment(formattedData.loaded_date).format('YYYY-MM-DD');
	      }
	    } 
	    if(!!formattedData.container_destination_arrival_date) {
	      if(moment(formattedData.container_destination_arrival_date, 'DD-MM-YYYY', true).isValid()) {
	        formattedData.container_destination_arrival_date = moment(formattedData.container_destination_arrival_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
	      } else if(moment(formattedData.container_destination_arrival_date, 'YYYY-MM-DD', true).isValid()) {
	        formattedData.container_destination_arrival_date = moment(formattedData.container_destination_arrival_date, 'YYYY-MM-DD').format('YYYY-MM-DD');

	      } else {
	        formattedData.container_destination_arrival_date = moment(formattedData.container_destination_arrival_date).format('YYYY-MM-DD');
	      }
	    }

	    formattedData.ids = [];
	    angular.forEach($scope.selectedRows, function(v, i) {
		    formattedData.ids.push(v.id); 
	    });
	    formattedData.ids = formattedData.ids.join(',');

    	apiFactory.bt
    		.updateBulkAssign({
	    		data: formattedData
	    	})
    		.then(function(retData) {
    			if(retData.status === 200) {
    				toaster.success('Saved Successfully.');
    				clearBulkForm();
    				$scope.onClickFilterApply();
					} else {
    				toaster.error('Error while saving, please try again later.');
  				}
    		}, function(err) {
					if(err.status == 403) {
						$state.go('signin');
					} else {
	  				toaster.error('Error while saving, please try again later.');	
	  			}
    		});
    } else {
			toaster.error('Please submit a valid form.');
		}
	}

	$scope.upload = function (file) {
		blockUI.start('Uploading started');

		$timeout(function() {
		  blockUI.message('We are uploading your request ...'); 
		}, 3000);

		$timeout(function() { 
		  blockUI.message('Almost there ...'); 
		}, 6000); 

		$timeout(function() { 
		  blockUI.message('Re-arranging the data for the best view ...'); 
		}, 10000); 

    Upload.upload({
        url: appConstants.apiUrlBase + 'up',
        data: {import_this: file, 'username': $scope.username}
    }).then(function (resp) {
    	if(resp.data.error.code === 0 || resp.data.error.code === 200) {
    		toaster.success('Successfully uploaded');
    		blockUI.stop();
    		$timeout(function() {
					$state.reload();
				}, 1000);
    	} else {
    		var msg = resp.data.error.msg || 'Error while uploading. Please try again later';
    		toaster.error(msg);
	  		blockUI.stop();
    	}
        // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
  		blockUI.stop();
    	if(resp.status == 403) {
    		$location.path('/singin');
    	} else {
	    		var msg = resp.data.error.msg || 'Error while uploading. Please try again later';
	    		toaster.error(msg);
	    }
        // console.log('Error status: ' + resp.status);
    }, function (evt) {
        // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };

  $scope.upload_status_msgs = {};

	$scope.uploadStatus = function (file) {
		blockUI.start('Uploading started');

		$timeout(function() {
		  blockUI.message('We are uploading your request ...'); 
		}, 3000);

		$timeout(function() { 
		  blockUI.message('Almost there ...'); 
		}, 6000); 

		$timeout(function() { 
		  blockUI.message('Re-arranging the data for the best view ...'); 
		}, 10000); 

    Upload.upload({
        url: appConstants.apiUrlBase + 'up/status',
        data: {import_this_status: file}
    }).then(function (resp) {
    	if(resp.data.error.code === 0 || resp.data.error.code === 200) {
    		toaster.success('Successfully uploaded');
    		$scope.upload_status_msgs = resp.data.data || {};
    		console.log($scope.upload_status_msgs);
    		blockUI.stop();
    	} else {
    		var msg = resp.data.error.msg || 'Error while uploading. Please try again later';
    		toaster.error(msg);
	  		blockUI.stop();
    	}
        // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
  		blockUI.stop();
    	if(resp.status == 403) {
    		$state.go('singin');
    	} else {
    		var msg = resp.data.error.msg || 'Error while uploading. Please try again later';
    		toaster.error(msg);
    	}
        // console.log('Error status: ' + resp.status);
    }, function (evt) {
        // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };

	$scope.uploadMapBoxTracking = function (file) {
		blockUI.start('Uploading started');

		$timeout(function() {
		  blockUI.message('We are uploading your request ...'); 
		}, 3000);

		$timeout(function() { 
		  blockUI.message('Almost there ...'); 
		}, 6000); 

		$timeout(function() { 
		  blockUI.message('Re-arranging the data for the best view ...'); 
		}, 10000); 

    Upload.upload({
        url: appConstants.apiUrlBase + 'up/mapBoxTracking',
        data: {import_this_map_box_tracking: file}
    }).then(function (resp) {
    	if(resp.data.error.code === 0 || resp.data.error.code === 200) {
    		toaster.success('Successfully uploaded');
    		$scope.import_this_map_box_tracking = '';
    		$scope.upload_map_box_tracking_msgs = resp.data.data || {};
    		console.log($scope.upload_map_box_tracking_msgs);
    		blockUI.stop();
    	} else {
    		var msg = resp.data.error.msg || 'Error while uploading. Please try again later';
    		toaster.error(msg);
	  		blockUI.stop();
    	}
        // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
  		blockUI.stop();
    	if(resp.status == 403) {
    		$state.go('singin');
    	} else {
    		var msg = resp.data.error.msg || 'Error while uploading. Please try again later';
    		toaster.error(msg);
    	}
        // console.log('Error status: ' + resp.status);
    }, function (evt) {
        // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };

  $scope.deleteThisItem = function (argIndex, argRef) {
  	var result = confirm("Confirm to delete?");
		if (result) {
	  	apiFactory.bt.delete({
	  		id: argRef.id
	  	}).then(function(retData) {
	  		// retData = retData.data || [];
	  		if(retData.status === 200) {
	  			if(retData.data.error.status == 200) {
		  			toaster.success('Deleted Successfully');
		  			// $scope.tableData.splice(argIndex, 1);
		  			// $state.reload();
		  			$scope.onClickFilterApply();
					} else {
		  			toaster.success('Invalid Deletion');
		  		}
	  		} else {
	  			toaster.error('Issue while deleting. Please try again later.');
	  		}
	  	}, function(retData) {
				if(retData.status == 403) {
					$state.go('signin');
				}
			});
		}
  }

}]);
