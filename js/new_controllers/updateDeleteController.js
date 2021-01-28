app.controller('updateDeleteController', [
				'$scope', '$rootScope', '$state', 'toaster', 'frontEndData', 'apiFactory', 'formFactory',  
function($scope, 	$rootScope, 	$state, toaster, frontEndData, apiFactory, formFactory,){ 
	
	$rootScope.stateParams = angular.copy($state.params);
	$scope.deletes = [];

	var initDataTable = function () {
		if ( $.fn.dataTable.isDataTable( '#bt_table' ) ) {
		  // table.destroy();
		  $('#bt_table').DataTable().destroy();
		}
		setTimeout(function() {
			table = $('#bt_table').DataTable({
				"fixedHeader": true,
				"destroy": true,
				"scrollX": true,
				"scrollY": "500px",
			  "scrollCollapse": false,
			  // "paging": true,
			  "fixedColumns": {
		      "leftColumns": 2
		    },
			});

			// .page.len( 10 ).draw();
			// console.log(table.info());
		}, 200);
	}

	$scope.getPageData = function () {
  	apiFactory
  		.payment
  		.getDeletes()
  		.then(function(retData) {
				if(retData.status === 200) {
					$scope.deletes = retData.data || [];
				} else {
					toaster.error('Error in action. Please try again after some time.');
				}
  		});
	}
	$scope.getPageData();

	$scope.getInvoiceData = function () {
  	apiFactory
  		.bt
  		.getDeletes()
  		.then(function(retData) {
				if(retData.status === 200) {
					$scope.tableData = retData.data || [];
					initDataTable();
				} else {
					toaster.error('Error in action. Please try again after some time.');
				}
  		});
	}
	$scope.getInvoiceData();

}]);
