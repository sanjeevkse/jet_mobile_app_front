app.controller('userListController', [
				'$scope', '$rootScope', '$state', 'apiFactory', 'toaster', 'apiFactory', '$modal', 
function($scope, 	$rootScope, 	$state, apiFactory, toaster, apiFactory, $modal){ 
	
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';
	$scope.show = false;

	var getUsers = function () {
		apiFactory.master.getUsers().then(function(retData) {
			$scope.usersData = retData.data || [];
			
			setTimeout(function() {
			    $('#userTable').DataTable({
                    "fixedHeader": true,
                    "scrollX": true,
                    scrollY: '560px',
                     "order": [],
                    "scrollCollapse": false,
                    "fixedColumns": {
                        "leftColumns": 3
                    },
                    "bLengthChange" : false, //thought this line could hide the LengthMenu
                    "bInfo":false,  
                    "bPaginate": false,
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>'
                    },
    			});
			}, 1000)
		});
	}
	getUsers();
	
	$scope.onClickDeactivate = function(argUserData) {
	    console.log(argUserData);
      var modalInstance = $modal.open({
        templateUrl: 'userDeactivateModal.html',
        controller: 'userDeactivateModalController',
        size: '',
        resolve: {
          userData: function () {
            return argUserData;
          }
        }
      });
	}
	
}]);
app.controller('userDeactivateModalController', [
				'$scope', '$rootScope', '$state', 'apiFactory', 'toaster', 'apiFactory', '$modal', 'userData', 
function($scope, 	$rootScope, 	$state, apiFactory, toaster, apiFactory, $modal, userData){ 
	
// 	console.log('inside invoiceStatusModalController');
// 	console.log(userData);
	$scope.formats = 'dd-MM-yyyy';

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 0,
        class: 'datepicker', 
        showWeeks: false
    };
    $scope.opened = false;
    
    $scope.openDateOfDeactivation = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        
        $scope.opened = true;
    };
	
	$scope.mainForm = {
	    user_id: {
	        value: userData.id,
	        error: false,
	        validPattern: 'required'
	    },
	    deactivation_date: {
	        value: '',
	        error: false,
	        validPattern: 'required'
	    }
	};
	
	$scope.closeModal = function() {
	    $modal.dismiss();
	}
	
	$scope.confirmDeactivation = function() {
	    
	    if(!$scope.mainForm.user_id.value || !$scope.mainForm.deactivation_date.value) {
	        toaster.error('Please submit a valid form');
	    } else {
	        var formatedData = {
	            user_id: $scope.mainForm.user_id.value,
	            deactivation_date: moment($scope.mainForm.deactivation_date.value).format('YYYY-MM-DD')
	        };
	        apiFactory
	            .user.deactivateUser(formatedData)
	            .then(function(retData) {
	                toaster.success('User Deactivated Successfully');
	                setTimeout(function() {
    	                location.reload();
	                }, 1000)
	            })
	    }
	    
	}
	
}]);
