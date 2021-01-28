app.controller('sLFListController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'Upload', 'appConstants', '$state', 'blockUI', '$timeout', '$localStorage', 'formFactory', '$location',
function($scope, 	$rootScope, $state, toaster, frontEndData, apiFactory, Upload, appConstants, $state, blockUI, $timeout, $localStorage, formFactory, $location){ 
	
	$rootScope.stateParams = angular.copy($state.params);

	$scope.tableData = [];
	var table = '';

	var initDataTable = function () {
		if ( $.fn.dataTable.isDataTable( '#slf_table' ) ) {
		  // table.destroy();
		  $('#slf_table').DataTable().clear().destroy();
		}
		setTimeout(function() {
			table = $('#slf_table').DataTable({
				"fixedHeader": true,
				"destroy": true,
				"scrollX": true,
				"scrollY": "500px",
			  "scrollCollapse": false,
			  "paging": false,
			  info: true,
			  "fixedColumns": {
		      "leftColumns": 2
		    },
		    dom: 'Bfrtip',
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
        columnDefs: [
        	{ type: 'date-uk', targets: 2 },
        	{ type: 'date-uk', targets: 5 },
        	{ type: 'date-uk', targets: 8 },
        ],
        order: [[2, 'desc']]
			});

			// .page.len( 10 ).draw();
			// console.log(table.info());
		}, 200);
	}

  apiFactory.slf.getAll().then(function(retData) {
  	if(retData.status == 200) {
  		$scope.tableData = retData.data || [];
  		angular.forEach($scope.tableData, function(v, i) {
  			var ed = moment(v.estimated_arrival_date, 'YYYY-MM-DD');
  			var ld = moment(v.loaded_date, 'YYYY-MM-DD');
  			$scope.tableData[i].duration = ed.diff(ld, 'days');
  		});
  		initDataTable();
  	}
  }, function(retData) {
		if(retData.status == 403) {
			$state.go('signin');
		}
	});

}]);
