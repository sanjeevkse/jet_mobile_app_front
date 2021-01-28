app.controller('creditFacilityController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'Upload', 'appConstants', '$state', 'blockUI', '$timeout', '$localStorage', 'formFactory', '$location',
function($scope, 	$rootScope, $state, toaster, frontEndData, apiFactory, Upload, appConstants, $state, blockUI, $timeout, $localStorage, formFactory, $location){ 
	
	$rootScope.stateParams = angular.copy($state.params);

	$scope.tableData = [];
	var table = '';
	$scope.dropdowns = {};
	$scope.dropdowns.arrDateRange = [
		{id: '30_0', text: 'Recent 30 Days'},
		{id: '40_30', text: '40 to 30 Days'},
		{id: '0_40', text: 'More than 40 Days'},
		{id: '0_0', text: '-ALL-'}
	];

	var initDataTable = function () {
		if ( $.fn.dataTable.isDataTable( '#bt_table_credit' ) ) {
		  // table.destroy();
		  $('#bt_table_credit').DataTable().clear().destroy();
		}
		setTimeout(function() {
			table = $('#bt_table_credit').DataTable({
				"fixedHeader": true,
				"destroy": true,
				"scrollX": true,
				"scrollY": "500px",
			  "scrollCollapse": false,
			  "paging": false,
			  info: false,
			  // "fixedColumns": {
		   //    "leftColumns": 4
		   //  },
		    // dom: 'Bfrtip',
		    // buttons: [
      //       'colvis',
      //       {
	     //        text: "Export",
	     //        extend: "excelHtml5",
	     //        title: 'exported_'+moment().format('YYYY_MM_DD_HH_mm_ss'),
	     //        exportOptions: {
	     //        	columns: ':visible'
	     //        }
		    //     }
      //   ],
        columnDefs: [
        	{ type: 'date-uk', targets: 2 },
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
			.getByFiltersCredit({
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

	$scope.send40DaysEmail = function (argRef) {
		apiFactory.bt
			.send40DaysEmail({
				data: argRef
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
			.sendUnholdEmail({
				data: argRef
			})
			.then(function(retData) {
					$scope.onClickFilterApply();
					toaster.success('Unhold email successfully sent');
				}, function(error) {
					toaster.error('An Error occured. Please try again later');
				});
	}

	var resetControllerData = function () {
		$scope.filters = {
			date_range_credit: $scope.dropdowns.arrDateRange[0].id,
			paid_status: 'PENDING'
		};
		$scope.onClickFilterApply();
	}
	resetControllerData();
	
}]);
