app.controller('sLFPaymentMgmtController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory',  
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory,){ 
	
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';

	var clearForm = function () {
		$scope.mainForm = {
			id: {value: '',error: '',validPattern: ''},
			payment_mode_id: {value: 1, error: '',validPattern: 'required'},
			payment_party_type: {value: '',error: '',validPattern: 'required'},
			container_number: {value: '',error: '',validPattern: 'required'},
			paid_date: {value: '',error: '',validPattern: 'required'},
			entered_date: {value: moment().format('DD-MM-YYYY'),error: '',validPattern: 'required'},
			paid_amount: {value: '',error: '',validPattern: 'required'},
			notes: {value: '',error: '',validPattern: ''},
		};
		$scope.totalPaidAmount = 0;
	}
	var partialClearForm = function () {
		$scope.mainForm.id.value = '';
		$scope.mainForm.payment_party_type.value = '';
		$scope.mainForm.payment_mode_id.value = 1;
		$scope.mainForm.paid_date.value = '';
		$scope.mainForm.paid_amount.value = '';
		$scope.mainForm.notes.value = '';
		$scope.totalPaidAmount = 0;
	}
	clearForm();

	$scope.onClearPayment = function () {
		partialClearForm();
	}
  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 0,
    class: 'datepicker', 
    showWeeks: false
  };
  $scope.opened = false;

  $scope.openPickup = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.onClickEdit = function(argRef) {
  	clearForm();
  	angular.forEach(Object.keys($scope.mainForm), function(v, i) {
  		$scope.mainForm[v].value = argRef[v];
  		if(v == 'entered_date' || v == 'paid_date') {
	  		$scope.mainForm[v].value = moment(argRef[v], 'YYYY-MM-DD').format('DD-MM-YYYY');
			} else {
	  		$scope.mainForm[v].value = argRef[v];
			}
  	});
  }

  $scope.onClickDelete = function(argRef) {
  	var r = confirm('Are you sure want to delete?');
  	if(r) {
	  	apiFactory
	  		.payment
	  		.delete(argRef)
	  		.then(function(retData) {
					if(retData.status === 200) {
						toaster.success('Data Deleted Successfully');
						$scope.getPaymentDetails();
					} else {
						toaster.error('Error in action. Please try again after some time.');
					}
	  		}, function(retData) {
					if(retData.status == 403) {
						$state.go('signin');
					}
				});
	  }
  }

	$scope.paymentDetails = [];
	$scope.paymentPartyType = [
		{ id: 'FORWARDER', item_name: 'Forwarder' },
		{ id: 'SHIPPING_LINE', item_name: 'Shipping Line' },
		{ id: 'RELEASING_COMPANY', item_name: 'Releasing Company' }
	];

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
	

	$scope.getPaymentDetails = function () {
		clearErrors();
		console.log('dfdf');
		if($scope.mainForm.container_number.value) {
			apiFactory
				.containerPayment
				.getByContainerNumber($scope.mainForm.container_number.value)
				.then(function(retData) {
					$scope.paymentDetails = retData.data || [];
					$scope.totalPaidAmount = 0;
					angular.forEach($scope.paymentDetails.payments, function(v, i) {
						if(v.status == 1) {
							$scope.totalPaidAmount += v.paid_amount * 1;
						}
						$scope.paymentDetails.payments[i].payment_party_type_name = $scope.paymentPartyType.filter(function(vv) { 
								return vv.id, vv.id == $scope.paymentDetails.payments[i].payment_party_type;
							})[0].item_name;
					});
				});
		} else {
			toaster.error('Please enter invoice number');
		}
	}

	$scope.onChangePaidAmount = function () {
		console.log($scope.totalPaidAmount);
		if($scope.mainForm.paid_amount.value > ($scope.paymentDetails.master.invoice_amount_pesco - $scope.totalPaidAmount) && false) {
			toaster.error('Paid amount cant be more than pending amount');
			// $('#paid_amount').focus();
		}
	}

	var clearErrors = function () {
		$scope.mainForm.id.error = '';
		$scope.mainForm.payment_mode_id.error = '';
		$scope.mainForm.payment_party_type.error = '';
		$scope.mainForm.container_number.error = '';
		$scope.mainForm.paid_date.error = '';
		$scope.mainForm.entered_date.error = '';
		$scope.mainForm.paid_amount.error = '';
		$scope.mainForm.notes.error = '';
	}

	$scope.onSubmitPayment = function () {
		clearErrors();

    if (formFactory.validateFields($scope.mainForm)) {

			if($scope.mainForm.paid_amount.value > ($scope.paymentDetails.master.invoice_amount_pesco - $scope.totalPaidAmount) && false) {
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
					apiFactory.containerPayment
						.update({
							data: formattedData
						})
						.then(function(retData) {
							if(retData.status === 200) {
								toaster.success('Data Updated Successfully');
								partialClearForm();
								$scope.getPaymentDetails();
							} else {
								toaster.error('Error in submitting the form. Please try again after some time.');
							}
						}, function(retData) {
							if(retData.status == 403) {
								$state.go('signin');
							}
						});
				} else { // Insert
					apiFactory.containerPayment
						.save({
							data: formattedData
						})
						.then(function(retData) {
							if(retData.status === 200) {
								toaster.success('Data Saved Successfully');
								partialClearForm();
								$scope.getPaymentDetails();
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
