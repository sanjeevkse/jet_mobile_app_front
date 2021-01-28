app.controller('staffAttendanceFormController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory',  
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory){ 
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';
	$scope.maxDate = moment();

	var clearForm = function () {
		$scope.mainForm = {
			staff_id: {value: '', error: '',validPattern: 'required'},
			staff_full_name: {value: '', error: '',validPattern: 'required'},
			staff_attendance: {value: '', error: '',validPattern: ''},
			day_off: {value: '', error: '',validPattern: ''},
			attendance_date: {value: moment().format('DD-MM-YYYY'), error: '',validPattern: ''},
		};
	}
	clearForm();
	$scope.arrStaffAttendance = [];

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

  $scope.openAttendance = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

	var getAllStaffAttendance = function () {
	    var t = '';
        if(moment($scope.mainForm.attendance_date.value, 'DD-MM-YYYY', true).isValid()) {
            t = moment($scope.mainForm.attendance_date.value, 'DD-MM-YYYY').format('YYYY-MM-DD');
        } else {
            t = moment($scope.mainForm.attendance_date.value).format('YYYY-MM-DD');
        }
		apiFactory
			.master
			.attendance({
			    attendance_date: t
			})
			.then(function(retData) {
				$scope.arrStaffAttendance = retData.data || [];
			}, function(retData) {
				$scope.arrStaffAttendance = [];
			})
	}
	getAllStaffAttendance();
	
	$scope.onClickFetchAttendance = function() {
	    getAllStaffAttendance();
	}
	
	$scope.onChangeDayOff = function (argRef) {
	    if(argRef.day_off) {
	        argRef.staff_attendance = false;
	    }
	}
	
	$scope.onClickSubmit = function() {
	    var temp = angular.copy($scope.arrStaffAttendance);
	    var temp1 = temp.map(function(v) {
	        t = v;
	        if(moment(t.attendance_date, 'DD-MM-YYYY', true).isValid()) {
	            t.attendance_date = moment(t.attendance_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
	        } else {
	            t.attendance_date = moment(t.attendance_date).format('YYYY-MM-DD');
	        }
	        return t;
	    });
	   // console.log(temp1);
	   // return false;
	    apiFactory
	        .master
	        .saveAttendance({attendance: temp1})
	        .then(function(retData) {
	            toaster.success('Attendance submitted successfully.');
	            getAllStaffAttendance();
	        }, function(retData){
	            toaster.error('Error in submitting, try again later.');
	        })
	}

}]);
