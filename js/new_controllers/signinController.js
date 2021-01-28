'use strict';

/* Controllers */

app
  // Flot Chart controller 
  .controller('signinController', ['$scope', '$http', 'appConstants', '$localStorage', '$state', function($scope, $http, appConstants, $localStorage, $state) {
  	
  	$scope.dt = moment();
    $scope.stateParams = angular.copy($state.params);
    delete $localStorage.user;
    $http.defaults.headers.common.Authorization = '';
    $scope.app.settings.asideFixed = false;

    var clearForm = function () {
	  	$scope.userForm = {
	  		username: '',
	  		password: '',
	  		errorMsg: ''
	  	};
	  }
		clearForm();
  	
  	$scope.OnClickLogIn = function () {
  		$scope.userForm.errorMsg = '';	
  		$http({
  			method: 'POST', 
  			url: appConstants.apiUrlBase + 'auth/login', 
  			data: {
    			'username': $scope.userForm.username,
    			'password': $scope.userForm.password,
    		}
    	})
  		.then(function (retData) {
		  	retData = retData.data;
		  	$localStorage.user = retData;
		  	$localStorage.user.token = 'Bearer ' + $localStorage.user.token;
		  	$http.defaults.headers.common.Authorization = $localStorage.user.token;
		  	// console.log($localStorage.user.user.user_role_id);
        if ([3].indexOf($localStorage.user.user.user_role_id * 1) >= 0) {
          $state.go('app.dashboard');
        } else if($localStorage.user.user.user_role_id * 1 == 35) { 
            $state.go('app.updateBoxStatus');
        } else if($localStorage.user.user.user_role_id * 1 == 6) { 
            $state.go('app.salesAgentTasks');
        } else if([36, 47, 48].indexOf($localStorage.user.user.user_role_id * 1) >= 0) { 
            $state.go('app.manifest2');
        } else {
          $state.go('app.newBoxTracking', { t: 'n'});
        }
		  }, function (retData) {
		  	$scope.userForm.errorMsg = retData.data ? retData.data.data || 'Facing issue to login. Please try again later.' : 'Facing issue to login. Please try again later.';
		  });
  	}

  }]);