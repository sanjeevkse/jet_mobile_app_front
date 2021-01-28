app.controller('staffAttendanceMonthlyReportController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory',  
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory){ 
	$rootScope.stateParams = angular.copy($state.params);

	$scope.arrStaffAttendance = [];
	$scope.attendance_for = '';
	$scope.report = {
		selMonth: moment().format('MM'),
		selYear: moment().format('YYYY') * 1
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
	for(i=2020; i<=moment().format('YYYY'); i++) {
		console.log(i)
		$scope.arrYears.push({key: i, value: i});
	}

	var getAllStaffAttendance = function () {
		$scope.attendance_for = $scope.report.selYear + '-' + $scope.report.selMonth + '-01';
		apiFactory
			.master
			.getAttendanceMonthly({
			    month_start_date: $scope.attendance_for
			})
			.then(function(retData) {
				$scope.arrStaffAttendance = retData.data || [];
				setTimeout(function() {
				    $('#staff_attendance_table').DataTable({
                        "fixedHeader": true,
            			"destroy": true,
                        "scrollX": true,
                        "scrollCollapse": false,
                        "paging": false,
                        "sort": false,
                        "fixedColumns": {
                            "leftColumns": 2
                        },
                        dom: 'Blfrtip',
                        buttons: [
                            'colvis',
                            {
                                text: "Export",
                                extend: "excelHtml5",
                                title: 'attendance_'+moment($scope.attendance_for, 'YYYY-MM-DD').format('MM-YYYY')+'_'+moment().format('YYYY_MM_DD_HH_mm_ss'),
                                exportOptions: {
                            	    columns: ':visible'
                                },
                                collectionLayout: 'fixed two-column'
                            }
                        ],
            	    });
				}, 500);
			}, function(retData) {
				$scope.arrStaffAttendance = [];
			})
	}
	getAllStaffAttendance();

	$scope.onClickGetReport = function () {
		getAllStaffAttendance();
	}


}]);
