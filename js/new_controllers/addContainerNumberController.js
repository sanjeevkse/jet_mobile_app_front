app.controller('addContainerNumberController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'Upload', 'appConstants', '$state', 'blockUI', '$timeout', '$localStorage', 'formFactory', '$location', '$compile', '$modal',
function($scope, 	$rootScope, $state, toaster, frontEndData, apiFactory, Upload, appConstants, $state, blockUI, $timeout, $localStorage, formFactory, $location, $compile, $modal){ 
	
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
	$scope.ourDraw = 1;

	var initDataTable = function (argFilters) {
		$('#bt_table').DataTable({
            "fixedHeader": true,
			"destroy": true,
            "scrollX": true,
            scrollY: '560px',
            "scrollCollapse": false,
            info: true,
            "fixedColumns": {
                "leftColumns": 3
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>'
            },
            lengthMenu: [[10, 25, 100, -1], [10, 25, 100, "All"]],
            dom: 'Blfrtip',
            
            "fnPreDrawCallback":function(){
                //alert("Pre Draw");
                // console.log('dfdf');
                $('#fetch_te').removeClass('hidden');
            },
            "fnDrawCallback": function() {
                /* Apply the jEditable handlers to the table */
                // console.log('drawn');
                $('#fetch_te').addClass('hidden');
                $('#structure_te').removeClass('hidden');
                setTimeout(function() {
                    $('#ready_te').removeClass('hidden');
                    $('#structure_te').addClass('hidden');
                }, 1000);
                setTimeout(function() {
                    $('#ready_te').removeClass('hidden');
                }, 2000);
                setTimeout(function() {
                    $('#ready_te').addClass('hidden');
                    // alert('Your data is ready get exported for the length' + $('[name="bt_table_length"]').text());
                }, 3000);
            },
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
            /* columnDefs: [
                { type: 'date-uk', targets: [1, 4, 7] },
            ], */
            order: [[1, 'desc']],
		    processing: true,
            serverSide: true,
            ajax: {
                url: appConstants.apiUrlBase + 'bt/getByFilters2',
                data: function(d) {
                    d.filterData = angular.copy(argFilters);
                },
                method: 'post'
            },
              createdRow: function(row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
                // console.log(row, data, dataIndex);
                // console.log($(row).addClass('bulk_selected'));
                $(row).attr('data-refpid', data.id);
                if($scope.selectedRows.some(function(o){return o['id'] === data.id;})) {
                    $(row).addClass('bulk_selected');
                }
              },
            'columns': [
                { 
                    target: 0,
                    render: function (data, type, row ) {
                        return "<a class=\"btn btn-xs btn-primary\" ng-click=\"onClickAddBulk($index, '"+escape(JSON.stringify(row))+"')\"><i class=\"fa fa-plus\"></i></a>";
                        // var href = $compile('<a ng-click="onClickAddBulk($index, '+row.invoice_number+')"></a>')($scope)[0].href;
                        // return '<a class="btn btn-xs btn-primary" href="' + href + '"><i class="fa fa-plus"></i></a>';
                    }
                },
                { 
                    'data': 'pick_up_date', 
                    render: function ( data, type, row ) {
                        if(moment(data, 'YYYY-MM-DD').isValid()) {
                            return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY');
                        } else {
                            return data;
                        }
                   }
                },
                { 'data': 'invoice_number' },
                { 'data': 'tracking_number' },
                { 
                    'data': 'loaded_date',
                    render: function ( data, type, row ) {
                        if(moment(data, 'YYYY-MM-DD').isValid()) {
                            return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY');
                        } else {
                            return data;
                        }
                   }
                },
                { 'data': 'container_number' },
                { 'data': 'forwarder_data_name' },
                { 
                    'data': 'container_destination_arrival_date',
                    render: function ( data, type, row ) {
                        if(moment(data, 'YYYY-MM-DD').isValid()) {
                            return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY');
                        } else {
                            return data;
                        }
                   }
                },
                { 'data': 'box_unique_number' },
                { 'data': 'quantity' },
                { 'data': 'box_status_data_name' },
                { 'data': 'box_length' },
                { 'data': 'box_breadth' },
                { 'data': 'box_height' },
                { 'data': 'cbm' },
                { 'data': 'package_type_data_name' },
                { 'data': 'is_box_descrapency' },
                { 'data': 'destination_data_name' },
                { 'data': 'port_data_name' },
                { 'data': 'consignee_name' },
                { 'data': 'consignee_phone_number' },
                { 'data': 'consignee_address' },
                { 'data': 'supplier_name' },
                { 'data': 'supplier_phone_number' },
                { 'data': 'supplier_address' },
                { 'data': 'sales_agent_data_name' },
                { 'data': 'driver_data_name' },
                { 'data': 'cash_amount' },
                { 'data': 'credit_amount' },
                { 'data': 'invoice_total_amount' },
                { 'data': 'notes' },
            ]
	    });
	}
	initDataTable();

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
    initDataTable(filterParams);
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
	// $scope.onClickFilterApply();

	$scope.onClickAddBulk = function (argIndex, argRef) {
	    argRef = unescape(argRef);
	    argRef = JSON.parse(argRef);
	    toaster.success('Added successfully for assign in bulk');
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
	
	$scope.popupInvoiceStatus = function(dataId) {

      var modalInstance = $modal.open({
        templateUrl: 'invoiceStatusModal.html',
        controller: 'invoiceStatusModalController',
        size: '',
        resolve: {
          dataId: function () {
            return dataId;
          }
        }
      });

    //   modalInstance.result.then(function (selectedItem) {
        // $scope.selected = selectedItem;
    //   }, function () {
        // 
    //   });
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
app.controller('invoiceStatusModalController', [
				'$scope', '$rootScope', 'dataId', 'apiFactory', '$modalInstance', 
function($scope, 	$rootScope, dataId, apiFactory, $modalInstance){
    $scope.boxDetails= {};
	apiFactory
		.boxStatus
		.getExistingBoxStatusById(dataId)
		.then(function(retData) {
			var t = retData.data || [];
			$scope.boxDetails.trackingDetails = t.trackingDetails;
			$scope.boxDetails.boxStatusDetails = t.boxStatusDetails;
			console.log($scope.boxDetails);
		});
		

    $scope.ok = function () {
      $modalInstance.dismiss('cancel');
    };
}]);

