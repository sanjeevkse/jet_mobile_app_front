app.controller('staffPayrollController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory',  
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory){ 
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';
	$scope.payrollSelections = {
	    month: moment().format('MM'),
	    year: moment().format('YYYY') * 1
	};
	$scope.payrollStaff = {
	    id: '',
	};
	$scope.arrMonths = [
	    {key: '01', value: 'January'},
	    {key: '02', value: 'February'},
	    {key: '03', value: 'March'},
	    {key: '04', value: 'April'},
	    {key: '05', value: 'May'},
	    {key: '06', value: 'June'},
	    {key: '07', value: 'July'},
	    {key: '08', value: 'August'},
	    {key: '09', value: 'September'},
	    {key: '10', value: 'October'},
	    {key: '11', value: 'November'},
	    {key: '12', value: 'December'},
	];
	$scope.arrYears = [];
	for(i = 2020; i <= moment().format('YYYY'); i++) {
	    $scope.arrYears.push({key: i, value: i});
	}

    $scope.arrStaffs = [];
    $scope.staffPayrollDetails = {};
    
    var getAllStaffs = function () {
        apiFactory
            .master.getUsers()
            .then(function(retData) {
               $scope.arrStaffs = retData.data || []; 
            });
    }
    getAllStaffs();
    
    var getStaffSalary = function () {
        apiFactory
            .user.getStaffPayroll({
                staff_id: $scope.payrollStaff.id,
                payroll_date: $scope.payrollSelections.year + '-' + $scope.payrollSelections.month + '-01'
            })
            .then(function(retData) {
                $scope.staffPayrollDetails = retData.data || {};
            });
        
    }
    
    $scope.onChangeMonth = function(argRef) {
        getStaffSalary();
    }
    
    $scope.onChangeYear = function(argRef) {
        getStaffSalary();
    }
    
    $scope.onClickStaff = function (argRef) {
        $scope.payrollStaff.id = argRef.id;
        getStaffSalary();
    }
    
    $scope.onChangeHeadAmount = function () {
        angular.forEach($scope.staffPayrollDetails.heads_with_salary, function(v) {
            $scope.staffPayrollDetails.total_payable_salary += v.head_amount * 1;
        });
    }
    
    $scope.onSubmitStaffSalary = function () {
        var temp = angular.copy($scope.staffPayrollDetails);
	    apiFactory
	        .master
	        .saveStaffPayroll({data: temp})
	        .then(function(retData) {
	            toaster.success('Attendance submitted successfully.');
	            getAllStaffAttendance();
	        }, function(retData){
	            toaster.error('Error in submitting, try again later.');
	        })
    }


}]);
