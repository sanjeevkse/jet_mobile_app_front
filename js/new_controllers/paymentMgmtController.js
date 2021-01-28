app.controller('paymentMgmtController', [
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
	$scope.dropdowns.arrDateRange = [
		{id: '15_0', text: 'Recent 15 Days'},
		{id: '30_15', text: '16 to 30 Days'},
		{id: '0_40', text: 'More than 30 Days'},
		{id: '0_0', text: '-ALL-'}
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
      date_range: ''
    };
  }
  resetControllerData();
  $scope.ourDraw = 1;

  var initDataTable = function (argFilters) {
	if($localStorage.user.user.user_role_id == 3) {
        $('#bt_table').DataTable({
            "fixedHeader": true,
            "destroy": true,
            "scrollX": true,
            scrollY: '560px',
            "scrollCollapse": false,
            info: true,
            "fixedColumns": {
                "leftColumns": 6
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
            order: [[3, 'desc']],
            processing: true,
            serverSide: true,
            ajax: {
                url: appConstants.apiUrlBase + 'payment/getAllPendings',
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
                // if($scope.selectedRows.some(function(o){return o['id'] === data.id;})) {
                //     $(row).addClass('bulk_selected');
                // }
              },
            'columns': [
                { 
                    target: 1,
                    render: function ( data, type, row ) {
                        return "<a class=\"btn btn-warning btn-xs\" ng-click=\"popupAllPayments({invoiceNumber: '"+row.invoice_number+"'})\"><i class=\"fa fa-eye\"></i> Payments</a><br /><div>Total: <b>"+row.sum_invoice_total_amount+"</b>, | Pending: <b>"+(row.sum_invoice_total_amount - row.sum_paid_amount)+"</b></div>";
                   }
                },
                { 
                    data: 'is_hold_email_sent',
                    render: function ( data, type, row ) {
                        if(data == 1) {
                            return 'Email sent';
                        } else {
                            return "<button class=\"btn btn-xs btn-primary\" ng-click=\"sendHoldEmail("+row.invoice_number+")\"><i class=\"fa fa-envelop\"></i> Send an email</button>";
                        }
                   }
                },
                { 
                    data: 'is_unhold_email_sent',
                    render: function ( data, type, row ) {
                        if(data == 1) {
                            return 'Email sent';
                        } else {
                            return "<button class=\"btn btn-xs btn-primary\" ng-click=\"sendUnholdEmail("+row.invoice_number+")\"><i class=\"fa fa-envelop\"></i> Send an email</button>";
                        }
                   }
                },
                // { 
                //     target: 2,
                //     render: function ( data, type, row ) {
                //         return "<button class=\"btn btn-info btn-xs\" ng-click=\"popupInvoiceStatus("+row.id+")\"><i class=\"fa fa-eye\"></i> Status</button>";
                //     //  var href = $compile('<button ng-click="popupInvoiceStatus('+row.invoice_number+')"></button>')($scope)[0];
                //     //  return '<button class="btn btn-info btn-xs" href="#"><i class="fa fa-eye"></i> Status</button>';
                //   }
                // },
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
                { 
                    'data': 'pick_up_date',
                    render: function ( data, type, row ) {
                        return moment(moment()).diff(moment(data, 'YYYY-MM-DD'), 'days');
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
                { 'data': 'forwarder_name' },
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
                { 'data': 'box_qty' },
                { 'data': 'port_name' },
                { 'data': 'consignee_name' },
                { 'data': 'consignee_phone_number' },
                { 'data': 'consignee_address' },
                { 'data': 'supplier_name' },
                { 'data': 'supplier_phone_number' },
                { 'data': 'supplier_address' },
                { 'data': 'sales_agent_name' },
                { 'data': 'driver_name' },
                { 'data': 'cash_amount' },
                { 'data': 'credit_amount' },
                { 'data': 'invoice_total_amount' },
                { 'data': 'notes' },
            ]
        });
    } else if ([47, 48].indexOf($localStorage.user.user.user_role_id*1) >= 0) {
        
        $('#bt_table3').DataTable({
            "fixedHeader": true,
            "destroy": true,
            "scrollX": true,
            scrollY: '560px',
            "scrollCollapse": false,
            info: true,
            "fixedColumns": {
                "leftColumns": 6
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
                'colvis'
            ],
            /* columnDefs: [
                { type: 'date-uk', targets: [1, 4, 7] },
            ], */
            order: [[3, 'desc']],
            processing: true,
            serverSide: true,
            ajax: {
                url: appConstants.apiUrlBase + 'payment/getAllPendings',
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
                // if($scope.selectedRows.some(function(o){return o['id'] === data.id;})) {
                //     $(row).addClass('bulk_selected');
                // }
              },
            'columns': [
                { 
                    target: 1,
                    render: function ( data, type, row ) {
                        return "<a class=\"btn btn-warning btn-xs\" ng-click=\"popupAllPayments({invoiceNumber: '"+row.invoice_number+"'})\"><i class=\"fa fa-eye\"></i> Payments</a><br /><div>Total: <b>"+row.sum_invoice_total_amount+"</b>, | Pending: <b>"+(row.sum_invoice_total_amount - row.sum_paid_amount)+"</b></div>";
                   }
                },
                { 
                    data: 'is_hold_email_sent',
                    render: function ( data, type, row ) {
                        if(data == 1) {
                            return 'Email sent';
                        } else {
                            return "<button class=\"btn btn-xs btn-primary\" ng-click=\"sendHoldEmail("+row.invoice_number+")\"><i class=\"fa fa-envelop\"></i> Send an email</button>";
                        }
                   }
                },
                { 
                    data: 'is_unhold_email_sent',
                    render: function ( data, type, row ) {
                        if(data == 1) {
                            return 'Email sent';
                        } else {
                            return "<button class=\"btn btn-xs btn-primary\" ng-click=\"sendUnholdEmail("+row.invoice_number+")\"><i class=\"fa fa-envelop\"></i> Send an email</button>";
                        }
                   }
                },
                // { 
                //     target: 2,
                //     render: function ( data, type, row ) {
                //         return "<button class=\"btn btn-info btn-xs\" ng-click=\"popupInvoiceStatus("+row.id+")\"><i class=\"fa fa-eye\"></i> Status</button>";
                //     //  var href = $compile('<button ng-click="popupInvoiceStatus('+row.invoice_number+')"></button>')($scope)[0];
                //     //  return '<button class="btn btn-info btn-xs" href="#"><i class="fa fa-eye"></i> Status</button>';
                //   }
                // },
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
                { 
                    'data': 'pick_up_date',
                    render: function ( data, type, row ) {
                        return moment(moment()).diff(moment(data, 'YYYY-MM-DD'), 'days');
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
                { 'data': 'forwarder_name' },
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
                { 'data': 'box_qty' },
                { 'data': 'port_name' },
                { 'data': 'consignee_name' },
                { 'data': 'consignee_phone_number' },
                { 'data': 'consignee_address' },
                { 'data': 'supplier_name' },
                { 'data': 'supplier_phone_number' },
                { 'data': 'supplier_address' },
                { 'data': 'sales_agent_name' },
                { 'data': 'driver_name' },
                { 'data': 'cash_amount' },
                { 'data': 'credit_amount' },
                { 'data': 'invoice_total_amount' },
                { 'data': 'notes' },
            ]
        });
    }
  }
  initDataTable();

	$scope.sendHoldEmail = function (argRef) {
	    console.log(argRef);
		apiFactory.bt
			.sendHoldEmail({
				invoice_number: argRef
			})
			.then(function(retData) {
					$scope.onClickFilterApply();
					toaster.success('Hold email successfully sent');
				}, function(error) {
					toaster.error('An Error occured. Please try again later');
				});
	}

	$scope.sendUnholdEmail = function (argRef) {
		apiFactory.bt
			.sendUnholdEmail2({
				invoice_number: argRef
			})
			.then(function(retData) {
					$scope.onClickFilterApply();
					toaster.success('Unhold email successfully sent');
				}, function(error) {
					toaster.error('An Error occured. Please try again later');
				});
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
    initDataTable(filterParams);
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
  }
  
  $scope.popupAllPayments = function(data) {

    var modalInstance = $modal.open({
      templateUrl: 'invoicePaymentsModal.html',
      controller: 'invoicePaymentsModalController',
      scope: $scope,
      size: '',
      resolve: {
        invoiceNumber: function () {
          return data.invoiceNumber;
        }
      }
    });
    
    modalInstance.result.then(function(){
      console.log("Modal Closed!!!");
      $scope.onClickFilterApply();
    }, function(){
      console.log("Modal Dismissed!!!");
      $scope.onClickFilterApply();
    });
  }

}]);
app.controller('invoiceStatusModalController', [
        '$scope', '$rootScope', 'dataId', 'apiFactory', '$modalInstance', 
function($scope,  $rootScope, dataId, apiFactory, $modalInstance){
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
app.controller('invoicePaymentsModalController', [
        '$scope', '$rootScope', 'invoiceNumber', 'apiFactory', '$modalInstance', 'formFactory', 'toaster', 
function($scope,  $rootScope, invoiceNumber, apiFactory, $modalInstance, formFactory, toaster){
    $scope.boxDetails= {};
	var clearForm = function () {
		$scope.mainForm = {
			id: {value: '',error: '',validPattern: ''},
			payment_mode_id: {value: 1, error: '',validPattern: 'required'},
			invoice_number: {value: invoiceNumber, error: '', validPattern: 'required'},
			receipt_number: {value: '',error: '',validPattern: 'required'},
			paid_date: {value: '',error: '',validPattern: 'required'},
			entered_date: {value: moment().format('DD-MM-YYYY'),error: '',validPattern: 'required'},
			paid_amount: {value: '',error: '',validPattern: 'required'},
			pending_amount: {value: '',error: '',validPattern: ''},
			notes: {value: '',error: '',validPattern: ''},
		};
		$scope.totalPaidAmount = 0;
	}
	clearForm();
    $scope.formats = 'dd-MM-yyyy';

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 0,
        class: 'datepicker', 
        showWeeks: false
    };
    $scope.openedPaidDate = false;
    $scope.openPaidDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        
        $scope.openedPaidDate = true;
    };

	$scope.paymentModes = [];
	var getPaymentModes = function () {
		apiFactory.master.getByCategory({
			category: 'pm'
		}).then(function(retData) {
			if(retData.status === 200) {
				$scope.paymentModes = retData.data || [];
			} else {
				$scope.paymentModes = [];
			}
		}, function(err) {
			if(err.status == 403) {
				$state.go('signin');
			} else {
				console.log(err);
				$scope.paymentModes = [];
			}
		});
	}
	getPaymentModes();
	

	var clearErrors = function () {
		$scope.mainForm.id.error = '';
		$scope.mainForm.payment_mode_id.error = '';
		$scope.mainForm.invoice_number.error = '';
		$scope.mainForm.receipt_number.error = '';
		$scope.mainForm.paid_date.error = '';
		$scope.mainForm.entered_date.error = '';
		$scope.mainForm.paid_amount.error = '';
		$scope.mainForm.pending_amount.error = '';
		$scope.mainForm.notes.error = '';
	}

	$scope.onSubmitPayment = function () {
		clearErrors();

        if (formFactory.validateFields($scope.mainForm)) {

			if($scope.mainForm.paid_amount.value > $scope.mainForm.pending_amount.value && false) {
				toaster.error('Paid amount cant be more than pending amount');
				$('#paid_amount').focus();
			} else {
                let formattedData = formFactory.formatFormDataForApi($scope.mainForm);
                if(moment(formattedData.paid_date, 'DD-MM-YYYY', true).isValid()) {
                    formattedData.paid_date = moment(formattedData.paid_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                } else {
                    formattedData.paid_date = moment(formattedData.paid_date).format('YYYY-MM-DD');
                }
                formattedData.entered_date = moment(formattedData.entered_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                console.log(formattedData);
                // return false;
				if(!!formattedData.id) { // Update
					apiFactory.payment
						.update({
							data: formattedData
						})
						.then(function(retData) {
							if(retData.status === 200) {
								toaster.success('Data Updated Successfully');
								clearForm();
								// scope.onClickFilterApply();
								// partialClearForm();
								// $scope.getInvoiceDetails();
							} else {
								toaster.error('Error in submitting the form. Please try again after some time.');
							}
						}, function(retData) {
							if(retData.status == 403) {
								$state.go('signin');
							}
						});
				} else { // Insert
					apiFactory.payment
						.save({
							data: formattedData
						})
						.then(function(retData) {
							if(retData.status === 200) {
								toaster.success('Data Saved Successfully');
								clearForm();
								// scope.onClickFilterApply();
								// partialClearForm();
								// $scope.getInvoiceDetails();
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
				}
			}
		} else {
			console.log($scope.mainForm);
			toaster.error('Please submit a valid form.');
		}
	}
	
	$scope.onClickPendingInvoice = function(argRef) {
	   // $scope.mainForm.invoice_number.value = argRef.invoice_number;
	   // $scope.mainForm.pending_amount.value = argRef.sum_invoice_total_amount - argRef.sum_paid_amount;
	    apiFactory
	        .payment
			.getInvoiceDetails(argRef)
			.then(function(retData) {
			    $scope.selectedInvoicePaymentDetails = retData.data.payment_history_details || [];
			});
	}
	$scope.onClickPendingInvoice({
	    invoice_number: invoiceNumber
	});
    

    $scope.ok = function () {
      $modalInstance.dismiss('cancel');
    };
}]);

