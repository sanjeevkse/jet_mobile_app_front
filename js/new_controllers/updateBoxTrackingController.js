app.controller('updateBoxTrackingController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory', 'Upload', 'appConstants',
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory, Upload, appConstants){ 
	console.log('dfdf');
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';

	var clearForm = function () {
		$scope.mainForm = {
		    id: {value: '', error: '',validPattern: 'required'},
			invoice_number: {value: '', error: '',validPattern: 'required'},
			box_unique_number: {value: '', error: '',validPattern: 'required'},
			tracking_number: {value: '', error: '',validPattern: ''},
			upload_file: {value: '', error: '', validPattern: ''},
			file_path_json: {value: '', error: '', validPattern: ''},
			
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
		$scope.mainForm.upload_file.error = '';
		$scope.mainForm.file_path_json.error = '';
	}

	var getBoxesForTrackingAndImages = function () {
		apiFactory
			.boxStatus
			.getBoxesForTrackingAndImages()
			.then(function(retData) {
				$scope.arrNotToday = retData.data || [];
			}, function(retData) {
				$scope.arrNotToday = [];
			})
	}
	getBoxesForTrackingAndImages();

	$scope.onClickPendingTask = function (argRef) {
		if(argRef) {
			apiFactory
				.boxStatus
				.getExistingBoxStatusByTrackingNumber(argRef.id)
				.then(function(retData) {
					var t = retData.data || [];
					$scope.mainForm.id.value = t.trackingDetails.id;
					$scope.mainForm.invoice_number.value = t.trackingDetails.invoice_number;
					$scope.mainForm.box_unique_number.value = t.trackingDetails.box_unique_number;
					$scope.mainForm.tracking_number.value = t.trackingDetails.tracking_number;
				});
		}
	}
	
	$scope.onSubmitAsYesterdayMainForm = function () {
	    console.log($scope.mainForm);
	    $scope.onSubmitMainForm();
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
      
      
      Upload.upload({
        url: appConstants.apiUrlBase + 'bt/trackAndImage',
        data: formattedData 
	    }).then(function (resp) {
    		if(resp.status === 200) {
    			toaster.success('Data Saved Successfully');
    			clearForm();
    			getBoxesForTrackingAndImages();
    		} else if(resp.status == 403) {
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
