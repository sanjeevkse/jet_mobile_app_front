app.controller('warehouseBoxesController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'Upload', 'appConstants', '$state', 'blockUI', '$timeout', '$localStorage', 'formFactory', '$location',
function($scope, 	$rootScope, $state, toaster, frontEndData, apiFactory, Upload, appConstants, $state, blockUI, $timeout, $localStorage, formFactory, $location){ 
	
	$rootScope.stateParams = angular.copy($state.params);

	$scope.tableData = [];
	var table = '';
	$scope.dropdowns = {};
	$scope.dropdowns.arrDateRange = [
		{id: '1000_0', text: '-All-'},
		{id: '5_0', text: 'Recent 5 Days'},
		{id: '10_5', text: '10 to 5 Days'},
		{id: '15_10', text: '15 to 10 Days'},
		{id: '0_15', text: 'More than 15 Days'}
	];

	var initDataTable = function () {
		if ( $.fn.dataTable.isDataTable( '#bt_table_ware' ) ) {
		  // table.destroy();
		  $('#bt_table_ware').DataTable().clear().destroy();
		}
		setTimeout(function() {
			table = $('#bt_table_ware').DataTable({
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

		apiFactory.bt
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
			});
	}

	var resetControllerData = function () {
		$scope.filters = {
			date_range: $scope.dropdowns.arrDateRange[0].id,
			boxes_in_warehouse: 'YES'
		};
		$scope.onClickFilterApply();
	}
	resetControllerData();

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

}]);
