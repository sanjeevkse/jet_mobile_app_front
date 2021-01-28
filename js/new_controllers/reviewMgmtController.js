app.controller('reviewMgmtControllers', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory', 'appConstants', '$compile', '$modal', 
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory, appConstants, $compile, $modal){ 
	
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';

	var clearForm = function () {
		$scope.mainForm = {
			id: {value: '', error: '',validPattern: ''},
			invoice_number: {value: '', error: '',validPattern: 'required'},
			box_unique_number: {value: '', error: '',validPattern: 'required'},
			tracking_number: {value: '', error: '',validPattern: ''},
			recent_updated_status: {value: '', error: '',validPattern: ''},
			box_status_date: {value: moment().format('DD-MM-YYYY'),error: '',validPattern: 'required'},
			box_status_id: {value: '', error: '',validPattern: 'required'},
			review_priority: {value: '', error: '',validPattern: ''},
			box_status_free_text: {value: '', error: '',validPattern: ''},
		};
		$scope.boxDetails = {
		    trackingDetails: {},
		    boxStatusDetails: []
		};
	}
	clearForm();
	$scope.arrNotToday = [];
	$scope.arrToday = [];

	$scope.onClearPayment = function () {
		clearForm();
	}
  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 0,
    class: 'datepicker', 
    showWeeks: false
  };
  $scope.opened = false;

  $scope.openBoxStatusDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

	$scope.arrBoxStatus = [];
	var getAllBoxStatus = function () {
		apiFactory.master.getByCategory({
			category: 'bs'
		}).then(function(retData) {
			if(retData.status === 200) {
			    var newSel = retData.data.filter(function(v) {
			        return v.id !== 39;
			    })
				$scope.arrBoxStatus = newSel || [];
			} else {
				$scope.arrBoxStatus = [];
			}
		}, function(err) {
			if(err.status == 403) {
				$state.go('signin');
			} else {
				console.log(err);
				$scope.arrBoxStatus = [];
			}
		});
	}
	getAllBoxStatus();

	var clearErrors = function () {
	    $scope.mainForm.id.error = '';
		$scope.mainForm.invoice_number.error = '';
		$scope.mainForm.tracking_number.error = '';
		$scope.mainForm.recent_updated_status.error = '';
		$scope.mainForm.box_status_date.error = '';
		$scope.mainForm.box_status_id.error = '';
		$scope.mainForm.review_priority.error = '';
		$scope.mainForm.box_status_free_text.error = '';
	}

	var getBoxStatusForUpdaterNotTodays = function (argFilters = {}) {
// 		apiFactory
// 			.boxStatus
// 			.getBoxStatusForUpdaterNotTodaysForReview()
// 			.then(function(retData) {
// 				$scope.arrNotToday = retData.data || [];
				$('#bt_review_table').DataTable({
                    "fixedHeader": true,
        			"destroy": true,
                    "scrollX": true,
                    scrollY: '560px',
                    "scrollCollapse": false,
                    info: true,
                    "fixedColumns": {
                        "leftColumns": 4
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
                    order: [[2, 'asc']],
        		    processing: true,
                    serverSide: true,
                    ajax: {
                        url: appConstants.apiUrlBase + 'bt/getBoxStatusForUpdaterNotTodays/1',
                        data: function(d) {
                            d.for_review = 1;
                            // d.filterData = angular.copy(argFilters);
                        },
                        method: 'post'
                    },
                      createdRow: function(row, data, dataIndex) {
                        $compile(angular.element(row).contents())($scope);
                        // console.log(row, data, dataIndex);
                        // console.log($(row).addClass('bulk_selected'));
                        $(row).attr('data-refpid', data.id);
                      },
                    'columns': [
                        { 
                            target: 0,
                            render: function (data, type, row ) {
                                // return "<div></div>";
                                //  ng-click="onClickPendingTask(v)"
                                return "<a class=\"btn btn-xs btn-primary\" ng-click=\"onClickPendingTask('"+escape(JSON.stringify(row))+"')\"><i class=\"fa fa-pencil\"></i> Update Status</a>";
                            }
                        },
                        { 
                            target: 1,
                            render: function ( data, type, row ) {
                                return "<button class=\"btn btn-info btn-xs\" ng-click=\"popupInvoiceStatus("+row.id+")\"><i class=\"fa fa-eye\"></i> All Status</button>";
                           }
                        },
                        { 
                            target: 2,
                            render: function ( data, type, row ) {
                                if(row.box_recent_status.box_status_id == 39 || row.box_recent_status.box_status_id == 49) {
                                    return "<div class=\"bg-danger\">"+row.invoice_number+"</div>";
                                } else if(row.box_recent_status.box_status_id == 50) {
                                    return "<div class=\"bg-warning\">"+row.invoice_number+"</div>";
                                } else if(row.box_recent_status.box_status_id == 51) {
                                    return "<div class=\"bg-success\">"+row.invoice_number+"</div>";
                                } else {
                                    return "<div class=\"\">"+row.invoice_number+"</div>";
                                }
                           }
                        },
                        { 'data': 'tracking_number' },
                        { 'data': 'forwarder_data_name' },
                        { 'data': 'cbm' },
                        { 'data': 'package_type_data_name' },
                        { 'data': 'consignee_name' },
                        { 'data': 'consignee_phone_number' },
                        { 'data': 'consignee_address' },
                        { 'data': 'supplier_name' },
                        { 'data': 'supplier_phone_number' },
                        { 'data': 'supplier_address' },
                        { 'data': 'sales_agent_data_name' },
                    ]
				});
// 			}, function(retData) {
// 				$scope.arrNotToday = [];
// 			})
	}
	getBoxStatusForUpdaterNotTodays();

	var getBoxStatusForUpdaterTodays = function () {
		apiFactory
			.boxStatus
			.getBoxStatusForUpdaterTodays()
			.then(function(retData) {
				$scope.arrToday = retData.data || [];
			}, function(retData) {
				$scope.arrToday = [];
			})
	}
	// getBoxStatusForUpdaterTodays();

	$scope.onClickPendingTask = function (argRef) {
		if(argRef) {
	        argRef = unescape(argRef);
		    argRef = JSON.parse(argRef);
			apiFactory
				.boxStatus
				.getExistingBoxStatusByTrackingNumber(argRef.id)
				.then(function(retData) {
					var t = retData.data || [];
					$scope.boxDetails.trackingDetails = t.trackingDetails;
					$scope.boxDetails.boxStatusDetails = t.boxStatusDetails;
					$scope.mainForm.id.value = t.trackingDetails.id;
					$scope.mainForm.invoice_number.value = t.trackingDetails.invoice_number;
					$scope.mainForm.box_unique_number.value = t.trackingDetails.box_unique_number;
					$scope.mainForm.tracking_number.value = t.trackingDetails.tracking_number;
				// 	$scope.mainForm.recent_updated_status.value = t.boxStatusDetails[t.boxStatusDetails.length-1].box_status_name || t.boxStatusDetails[t.boxStatusDetails.length-1].box_status_free_text;
				// 	$scope.mainForm.box_status_date.value = moment().format('DD-MM-YYYY');
				// 	$scope.mainForm.box_status_id.value = t.boxStatusDetails[t.boxStatusDetails.length-1].box_status_id * 1;
				// 	$scope.mainForm.review_priority.value = t.boxStatusDetails[t.boxStatusDetails.length-1].review_priority ? t.boxStatusDetails[t.boxStatusDetails.length-1].review_priority * 1 : '';
				// 	$scope.mainForm.box_status_free_text.value = t.boxStatusDetails[t.boxStatusDetails.length-1].box_status_free_text || '';;
				});
		}
	}

	$scope.onClickPendingTask_old = function (argRef) {
		if(argRef) {
	        argRef = unescape(argRef);
		    argRef = JSON.parse(argRef);
			apiFactory
				.boxStatus
				.getExistingBoxStatusByTrackingNumber(argRef.id)
				.then(function(retData) {
					var t = retData.data || [];
					$scope.boxDetails.trackingDetails = t.trackingDetails;
					$scope.boxDetails.boxStatusDetails = t.boxStatusDetails;
					console.log($scope.boxDetails);
					$scope.mainForm.id.value = t.trackingDetails.id;
					$scope.mainForm.invoice_number.value = t.trackingDetails.invoice_number;
					$scope.mainForm.box_unique_number.value = t.trackingDetails.box_unique_number;
					$scope.mainForm.tracking_number.value = t.trackingDetails.tracking_number;
					$scope.mainForm.recent_updated_status.value = t.boxStatusDetails[t.boxStatusDetails.length-1].box_status_name || t.boxStatusDetails[t.boxStatusDetails.length-1].box_status_free_text;
					$scope.mainForm.box_status_date.value = moment().format('DD-MM-YYYY');
					$scope.mainForm.box_status_id.value = t.boxStatusDetails[t.boxStatusDetails.length-1].box_status_id * 1;
					$scope.mainForm.review_priority.value = t.boxStatusDetails[t.boxStatusDetails.length-1].review_priority ? t.boxStatusDetails[t.boxStatusDetails.length-1].review_priority * 1 : '';
					$scope.mainForm.box_status_free_text.value = t.boxStatusDetails[t.boxStatusDetails.length-1].box_status_free_text || '';;
				});
		}
	}
	
	$scope.onSubmitAsYesterdayMainForm = function () {
	   // console.log($scope.mainForm);
	    $scope.onSubmitMainForm();
	}
	
	$scope.onSubmitMarkReviewManagement = function () {
	   // console.log($scope.mainForm);
	    apiFactory
	        .bt
	        .markReviewManagement({
	            btm_id: $scope.mainForm.id.value
	       })
	        .then(function(retData) {
				if(retData.status === 200) {
					toaster.success('Data Updated Successfully');
				} else if(retData.status == 403) {
					$state.go('signin');
				} else {
					toaster.error('Error in updating the data. Please try again after some time.');
				}
	        }, function(retData) {
				if(retData.status == 403) {
					$state.go('signin');
				}
			});
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
console.log($rootScope);
	$scope.onSubmitMainForm = function () {
		clearErrors();
    $scope.mainForm.box_status_date.value = moment().format('YYYY-MM-DD');
    if([3, 4].indexOf($rootScope.localStorageMemory.user.user_role_id * 1)>=0) {
        $scope.mainForm.box_status_id.value = 51;
    } else if([36, 40].indexOf($rootScope.localStorageMemory.user.user_role_id * 1)>=0) {
        $scope.mainForm.box_status_id.value = 50;
    }
    if (formFactory.validateFields($scope.mainForm)) {

      let formattedData = formFactory.formatFormDataForApi($scope.mainForm);
    //   if(moment(formattedData.box_status_date, 'DD-MM-YYYY', true).isValid()) {
    //     formattedData.box_status_date = moment(formattedData.box_status_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    //   } else {
    //     formattedData.box_status_date = moment(formattedData.box_status_date).format('YYYY-MM-DD');
    //   }

			apiFactory.boxStatus
				.saveBoxStatus({
					data: formattedData
				})
				.then(function(retData) {
					if(retData.status === 200) {
						toaster.success('Data Saved Successfully');
						clearForm();
						getBoxStatusForUpdaterNotTodays();
						// getBoxStatusForUpdaterTodays();
					} else if(retData.status == 403) {
						$state.go('signin');
					} else {
						toaster.error('Error in submitting the form. Please try again after some time.');
					}
				}, function(retData) {
					if(retData.status == 403) {
						$state.go('signin');
					}
				});
		} else {
			console.log($scope.mainForm);return false;
			alert('Please submit a valid form');
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
