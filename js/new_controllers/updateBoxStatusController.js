app.controller('updateBoxStatusController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory',  
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory){ 
	console.log('dfdf');
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';

	var clearForm = function () {
		$scope.mainForm = {
			id: {value: '', error: '',validPattern: ''},
			invoice_number: {value: '', error: '',validPattern: 'required'},
			box_unique_number: {value: '', error: '',validPattern: 'required'},
			tracking_number: {value: '', error: '',validPattern: ''},
			review_priority: {value: '', error: '', validPattern: ''},
			recent_updated_status: {value: '', error: '',validPattern: ''},
			box_status_date: {value: moment().format('DD-MM-YYYY'),error: '',validPattern: 'required'},
			box_status_id: {value: '', error: '',validPattern: 'required'},
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
				$scope.arrBoxStatus = retData.data || [];
				$scope.arrBoxStatus = $scope.arrBoxStatus.filter(function(v) {
				    return [41,42,43].indexOf(v.id*1) < 0;
				});
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
		$scope.mainForm.box_status_free_text.error = '';
	}

	var getBoxStatusForUpdaterNotTodays = function () {
		apiFactory
			.boxStatus
			.getBoxStatusForUpdaterNotTodays()
			.then(function(retData) {
				$scope.arrNotToday = retData.data || [];
			}, function(retData) {
				$scope.arrNotToday = [];
			})
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
					$scope.mainForm.box_status_free_text.value = t.boxStatusDetails[t.boxStatusDetails.length-1].box_status_free_text || '';;
				});
		}
	}
	
	$scope.onSubmitAsYesterdayMainForm = function () {
	    console.log($scope.mainForm);
	    $scope.onSubmitMainForm();
	}
	
	$scope.onSubmitMarkReviewManagement = function () {
	    console.log($scope.mainForm);
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

	$scope.onSubmitMainForm = function () {
		clearErrors();
    if (formFactory.validateFields($scope.mainForm)) {

      let formattedData = formFactory.formatFormDataForApi($scope.mainForm);
      if(moment(formattedData.box_status_date, 'DD-MM-YYYY', true).isValid()) {
        formattedData.box_status_date = moment(formattedData.box_status_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
      } else {
        formattedData.box_status_date = moment(formattedData.box_status_date).format('YYYY-MM-DD');
      }

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
