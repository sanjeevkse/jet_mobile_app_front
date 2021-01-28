app.controller('paymentMgmtController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory',  
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory,){ 
	
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';
	
	$scope.arrPendingInvoices = [];
	$scope.selectedInvoiceDetails = {};
	
	var getPendingInvoice = function () {
	    apiFactory
	        .payment
			.getAllPendings()
			.then(function(retData) {
			    $scope.arrPendingInvoices = retData.data || [];
			});
	}
	getPendingInvoice();
	
	$scope.onClickPendingInvoice = function(argRef) {
	    $scope.mainForm.invoice_number.value = argRef.invoice_number;
	    $scope.mainForm.pending_amount.value = argRef.sum_invoice_total_amount - argRef.sum_paid_amount;
	    apiFactory
	        .payment
			.getInvoiceDetails(argRef)
			.then(function(retData) {
			    $scope.selectedInvoiceDetails = retData.data || [];
			});
	}
	
	

	var clearForm = function () {
		$scope.mainForm = {
			id: {value: '',error: '',validPattern: ''},
			payment_mode_id: {value: 1, error: '',validPattern: 'required'},
			invoice_number: {value: '',error: '',validPattern: 'required'},
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

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 0,
    class: 'datepicker', 
    showWeeks: false
  };
  $scope.opened = false;
  $scope.openedCivil = false;
  $scope.openedDrivingLicense = false;

  $scope.openPickup = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.openCivil = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    console.log('here;');

    $scope.openedCivil = true;
  };

  $scope.openDrivingLicense = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedDrivingLicense = true;
  };

	$scope.invoiceDetails = [];

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
	

	$scope.getInvoiceDetails = function () {
		clearErrors();
		if($scope.mainForm.invoice_number.value) {
			apiFactory
				.payment
				.getByInvoiceNumber($scope.mainForm.invoice_number.value)
				.then(function(retData) {
					$scope.invoiceDetails = retData.data || [];
					$scope.totalPaidAmount = 0;
					angular.forEach($scope.invoiceDetails.payments, function(v, i) {
						if(v.status == 1) {
							$scope.totalPaidAmount += v.paid_amount * 1;
						}
					});
				});
		} else {
			toaster.error('Please enter invoice number');
		}
	}

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
				if(!!formattedData.id) { // Update
					apiFactory.payment
						.update({
							data: formattedData
						})
						.then(function(retData) {
							if(retData.status === 200) {
								toaster.success('Data Updated Successfully');
								partialClearForm();
								$scope.getInvoiceDetails();
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
								partialClearForm();
								$scope.getInvoiceDetails();
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

}]);
