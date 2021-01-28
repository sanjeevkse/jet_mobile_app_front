app.controller('userFormController', [
				'$scope', '$rootScope', '$state', 'apiFactory', 'toaster', 'apiFactory',  
function($scope, 	$rootScope, 	$state, apiFactory, toaster, apiFactory){ 
	
	$rootScope.stateParams = angular.copy($state.params);
	$scope.formats = 'dd-MM-yyyy';
	$scope.show = false;

	var clearForm = function () {
		$scope.mainForm = {
			id: { value: '', error: '', validPattern: ''},
            full_name: { value: '', error: '', validPattern: 'required'},
            user_role_id: { value: '', error: '', validPattern: 'required'},
            username: { value: '', error: '', validPattern: ''},
            password: { value: '', error: '', validPattern: ''},
            employee_number: { value: '', error: '', validPattern: ''},
            user_code: { value: '', error: '', validPattern: ''},
            nationality: { value: '', error: '', validPattern: ''},
            joining_date: { value: '', error: '', validPattern: ''},
            passport_number: { value: '', error: '', validPattern: ''},
            passport_expiry_date: { value: '', error: '', validPattern: ''},
            residential_company_id: { value: '', error: '', validPattern: ''},
            civil_number: { value: '', error: '', validPattern: ''},
            civil_expiry_date: { value: '', error: '', validPattern: ''},
            working_company_name_id: { value: '', error: '', validPattern: ''},
            driving_license_number: { value: '', error: '', validPattern: ''},
            driving_license_expiry_date: { value: '', error: '', validPattern: ''},
            staff_actual_salary: { value: '', error: '', validPattern: ''}
		};
	}

    if(!!$rootScope.stateParams.personId) {
        apiFactory.master.getUserById({
            personId: $rootScope.stateParams.personId
        }).then(function(retData) {
            retData = retData.data || {};
            angular.forEach(retData, function(v, i) {
                if($scope.mainForm[i]) {
                    if(i == 'residential_company_id' || i == 'working_company_name_id' || i == 'user_role_id') {
			            $scope.mainForm[i].value = v * 1;
                    } else if(i == 'joining_date' || i == 'passport_expiry_date' || i == 'civil_expiry_date' || i == 'driving_license_expiry_date') {
                        console.log(i, v);
                        if(v && v!='0000-00-00') $scope.mainForm[i].value = moment(v, 'YYYY-MM-DD').format('DD-MM-YYYY');
                        else  $scope.mainForm[i].value = '';
                    } else {
                        $scope.mainForm[i].value = v;
                    }
                }
            })
		});
    }

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 0,
        class: 'datepicker', 
        showWeeks: false
    };
    $scope.opened = false;
    $scope.openedCivil = false;
    $scope.openedDrivingLicense = false;
    
    $scope.openPasspostExpiryDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        
        $scope.opened = true;
    };
    
    $scope.openCivil = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        
        $scope.openedCivil = true;
    };
    
    $scope.openDrivingLicense = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        
        $scope.openedDrivingLicense = true;
    };
    
    $scope.openJoiningDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        
        $scope.openedJoiningDate = true;
    };

	var getUsers = function () {
		apiFactory.master.getUsers().then(function(retData) {
			$scope.usersData = retData.data || [];
		});
	}

	var getUserRoles = function () {
		apiFactory.master.getByCategory({
			category: 'ur'
		}).then(function(retData) {
			$scope.usersRoles = retData.data || [];
		});
	}

	var formatFormDataForApi = function (argFormData) {
    // var newObj = {};
    // angular.forEach(argFormData, function(v, i) {
    //   newObj[i] = v.value;
    // });
    // return newObj;
    return {
// 			full_name 			: argFormData.full_name.value,
// 			user_role_id 		: argFormData.user_role_id.value,
// 			username 				: argFormData.username.value,
// 			password 				: argFormData.password.value,
// 			id 							: argFormData.id.value
            id: argFormData.id.value, 
            full_name: argFormData.full_name.value, 
            user_role_id: argFormData.user_role_id.value, 
            username: argFormData.username.value, 
            password: argFormData.password.value, 
            employee_number: argFormData.employee_number.value, 
            user_code: argFormData.user_code.value, 
            nationality: argFormData.nationality.value, 
            joining_date: argFormData.joining_date.value, 
            passport_number: argFormData.passport_number.value, 
            passport_expiry_date: argFormData.passport_expiry_date.value, 
            residential_company_id: argFormData.residential_company_id.value, 
            civil_number: argFormData.civil_number.value, 
            civil_expiry_date: argFormData.civil_expiry_date.value, 
            working_company_name_id: argFormData.working_company_name_id.value, 
            driving_license_number: argFormData.driving_license_number.value, 
            driving_license_expiry_date: argFormData.driving_license_expiry_date.value, 
            staff_actual_salary: argFormData.staff_actual_salary.value
		};
	}

	var validateFields = function (argDataObj) {
		resetErrors(argDataObj); 
		angular.forEach(argDataObj, function (v, i) {
			let arrPattern = v.validPattern.split('|') || null;
			if (arrPattern.length) {
				angular.forEach(arrPattern, function (v1, i1) {
					switch (v1) {
						case 'required'	: !v.value || v.value === undefined || v.value === null ? v.error = true : ''; break;
						case 'numeric'	: {
							if (!(!v.value || v.value === undefined || v.value === null)) {
								if (!/^\d+(\.\d{1,2})?$/.test(v.value)) {
									v.error = true;
								}
							}
							break;
						} 
						case 'integer'	: {
							if (!(!v.value || v.value === undefined || v.value === null)) {
								if (!/^\d+$/.test(v.value)) {
									v.error = true;
								}
							}
							break;
						}
						case 'new_req_integer'	: {
							if (!!argDataObj.id.value) {
								if(v.value!='' && !/^(\-?(\d+))$/.test(v.value)) {
									v.error = true;
								}
							} else {
								if(!!v.value) {
								 	if(!/^(\-?(\d+))$/.test(v.value)) {
										v.error = true; 
									}
								} else {
									v.error = true; 
								}
							}
							break;
						}
					}
				});
			}
		});
		return checkValidateFields(argDataObj);
	}

	var checkValidateFields = function (argDataObj) {
		var isValid = true;
		angular.forEach(argDataObj, function (v, i) {
			if (v.error) isValid = false;
		});
		return isValid;
	}

	var resetErrors = function (argDataObj) {
		angular.forEach (argDataObj, function (v, i) {
			v.error = false;
		});
	}

	clearForm();
	getUsers();
	getUserRoles();


	$scope.clearState = function(){
		clearForm();
	}

	$scope.togglePasswordShow = function () {
		$scope.show = !$scope.show;
	}
	
	$scope.toggleInSlides = function (action, user) {
		apiFactory
			.master
			.showInSlides({
			    data: {
			        id: user.id,
			        show_in_slides: action == 'SHOW' ? 1 : (action == 'SHOW_WITH_PIC' ? 2 : 0)
			    }
			})
			.then(function(retData) {
				console.log(retData);
				toaster.pop('success', 'Updated', 'User updated');
				getUsers();
			}, function(retData) {
                if(retData.status == 300) {
                  // toaster.pop('error', 'Please correct the form errors', '');
                  toaster.pop('error', 'Please submit a valid form', '');
                } else if(retData.status == 403) {
					$state.go('signin');
				} else {
                  toaster.pop('error', 'Failed to update the user', 'Please try sometimes later');
                }
			});	
	}

	$scope.onUserSelect = function (argProductData) {
// 		resetErrors();
// 		$scope.mainForm.full_name.value 		= argProductData.full_name;
// 		$scope.mainForm.user_role_id.value 		= argProductData.user_role_id;
// 		$scope.mainForm.username.value 			= argProductData.username;
// 		$scope.mainForm.password.value 			= argProductData.password;
// 		$scope.mainForm.id.value 						= argProductData.id || '';
// 		$('[data-active_id]').removeClass('active');
// 		$('[data-active_id="'+$scope.mainForm.id.value+'"]').addClass('active');
	}
	

    apiFactory.firm.getAll().then(function(retData) {
        $scope.arrFirms = retData.data || []; 
    });

	$scope.submitForm = function() {
		if (validateFields($scope.mainForm)) {
			let formattedData = formatFormDataForApi($scope.mainForm);
			
			if(formattedData.passport_expiry_date) {
    	        if(moment(formattedData.passport_expiry_date, 'DD-MM-YYYY', true).isValid()) {
    	            formattedData.passport_expiry_date = moment(formattedData.passport_expiry_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    	        } else {
    	            formattedData.passport_expiry_date = moment(formattedData.passport_expiry_date).format('YYYY-MM-DD');
    	        }
			}
			
			if(formattedData.civil_expiry_date) {
    	        if(moment(formattedData.civil_expiry_date, 'DD-MM-YYYY', true).isValid()) {
    	            formattedData.civil_expiry_date = moment(formattedData.civil_expiry_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    	        } else {
    	            formattedData.civil_expiry_date = moment(formattedData.civil_expiry_date).format('YYYY-MM-DD');
    	        }
			}
			
			if(formattedData.driving_license_expiry_date) {
    	        if(moment(formattedData.driving_license_expiry_date, 'DD-MM-YYYY', true).isValid()) {
    	            formattedData.driving_license_expiry_date = moment(formattedData.driving_license_expiry_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    	        } else {
    	            formattedData.driving_license_expiry_date = moment(formattedData.driving_license_expiry_date).format('YYYY-MM-DD');
    	        }
			}
			
			if(formattedData.joining_date) {
    	        if(moment(formattedData.joining_date, 'DD-MM-YYYY', true).isValid()) {
    	            formattedData.joining_date = moment(formattedData.joining_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    	        } else {
    	            formattedData.joining_date = moment(formattedData.joining_date).format('YYYY-MM-DD');
    	        }
			}
			
			if (!!$scope.mainForm.id.value) {
				apiFactory
					.master
					.updateUser({
					    data: formattedData
					})
					.then(function(retData) {
						console.log(retData);
						toaster.pop('success', 'Updated', 'User Data Updated Successfully');
					}, function(retData) {
            if(retData.status == 300) {
              // toaster.pop('error', 'Please correct the form errors', '');
              toaster.pop('error', 'Please submit a valid form', '');
            } else if(retData.status == 403) {
							$state.go('signin');
						} else {
              toaster.pop('error', 'Failed to update the user', 'Please try sometimes later');
            }
					});	
			} else {
				apiFactory
					.master
					.saveUser({
						data: formattedData
					})
					.then(function(retData) {
						console.log(retData);
						toaster.pop('success', 'Created', 'User Data Added Successfully');
						clearForm();
					}, function(retData) {
            if(retData.status == 300) {
              // toaster.pop('error', 'Please correct the form errors', '');
              toaster.pop('error', 'Please submit a valid form', '');
            } else if(retData.status == 403) {
							$state.go('signin');
            } else {
              toaster.pop('error', 'Failed to create the user', 'Please try sometimes later');
            }
					});
			}
		} else {
			toaster.pop('error', 'Invalid Form Submittion', 'Please clear the errors of the form and resubmit it');
		}
	};
}]);
