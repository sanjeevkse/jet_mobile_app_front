app.factory('apiFactory', ['$http', 'appConstants', function($http, appConstants) {
	
	var master = {
		getOne: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'm/mId/' + argId);
		}, 
		getUserById: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'm/uId/' + argData.personId);
		},
		getUsers: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'm/u');
		},
		getUsersByCategory: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'm/uByCategory/' + argData.category);
		},
		getByCategory: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'm/mByCategory/' + argData.category);
		},
		getByCategories: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'm/mByCategories/' + argData.category);
		},
		getAllMaster: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'm/mAll');
		},
		getSupplier: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'm/sup' + (argData && argData.id ?  '/'+argData.id : ''));
		},
		saveMaster: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'm/forM', argData.data); 
		}, 
		saveSupplier: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'm/sup', argData.data); 
		}, 
		saveUser: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'm/user', argData.data); 
		}, 
		updateUser: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'm/user', argData.data); 
		}, 
		updateMaster: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'm/forM', argData.data); 
		}, 
		updateSupplier: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'm/sup', argData.data); 
		}, 
		showInSlides: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'users/showInSlides', argData.data); 
		}, 
	    attendance: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'users/attendance/'+argData.attendance_date);
		}, 
	    saveAttendance: function (argData) {
			return $http.post(appConstants.apiUrlBase + 'users/saveAttendance', argData);
		}, 
	    getAttendanceMonthly: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'users/attendanceMonthly/'+argData.month_start_date);
		}, 
	    saveStaffPayroll: function (argData) {
			return $http.post(appConstants.apiUrlBase + 'users/saveStaffPayroll', argData.data);
		}, 
		deleteMaster: function(argData) {
			return $http.delete(appConstants.apiUrlBase + 'm/forM/'+ argData.id); 
		}, 
		deleteSupplier: function(argData) {
			return $http.delete(appConstants.apiUrlBase + 'm/sup/'+ argData.id); 
		}, 
	};

	var firm = {
		getOne: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'f/' + argId);
		}, 
		getAll: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'f/getAll');
		},
		save: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'f', argData.data); 
		}, 
		update: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'f', argData.data); 
		}, 
		delete: function(argData) {
			return $http.delete(appConstants.apiUrlBase + 'f/'+ argData.id); 
		}, 
	};

	var bt = {
	    saveContainerNumber: function(argData) {
	        return $http.post(appConstants.apiUrlBase + 'bt/saveContainerNumber', argData);
	    },
	    updateSailed: function(argData) {
	        return $http.post(appConstants.apiUrlBase + 'bt/updateSailed', argData);
	    },
		getAllNotUpdatedContainers: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'bt/getAllNotUpdatedContainers');
		}, 
		getInvoicesByContainerNumber: function (argContainerNumber) {
			return $http.get(appConstants.apiUrlBase + 'bt/getInvoicesByContainerNumber/'+argContainerNumber);
		}, 
		getOne: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'bt/id/' + argId);
		}, 
		getDeletes: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'bt/getDeletes');
		}, 
		getByInvoiceNumber: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'bt/in/' + argId);
		}, 
		getAllNonContainerInvoiceNumbers: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'bt/getAllNonContainerInvoiceNumbers/'+argData);
		},
		getAll: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'bt/all');
		},
		checkInvoiceNumber: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'bt/checkInvoiceNumber/'+argData.invoice_number+'/'+argData.notin);
		},
		getContainerDetails: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'bt/getContainerDetails/'+argData.container_number);
		},
		updateBulkAssign: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'bt/updateBulkAssign', argData.data); 
		},
		markReviewManagement: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'bt/markReviewManagement', argData); 
		},
		markAsReviewed: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'bt/markAsReviewed', argData); 
		},
		getMarkReviewManagement: function(argData) {
			return $http.get(appConstants.apiUrlBase + 'bt/getMarkReviewManagement'); 
		},
		send40DaysEmail: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'bt/send40DaysEmail', argData.data); 
		},
		sendUnholdEmail: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'bt/sendUnholdEmail', argData.data); 
		},
		sendHoldEmail: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'bt/sendHoldEmail', argData); 
		},
		sendUnholdEmail2: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'bt/sendUnholdEmail2', argData); 
		},
		save: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'bt', argData.data); 
		},
		getSalesAgentsRankings: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'bt/getSalesAgentsRankings', argData.data); 
		}, 
		getByFilters: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'bt/getByFilters', argData.data); 
		}, 
		getByFiltersCredit: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'bt/getByFiltersCredit', argData.data); 
		}, 
		update: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'bt', argData.data); 
		}, 
		delete: function(argData) {
			return $http.delete(appConstants.apiUrlBase + 'bt/'+ argData.id); 
		}, 
	};

	var slf = {
		getOne: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'slf/id/' + argId);
		}, 
		getDeletes: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'slf/getDeletes');
		}, 
		getByInvoiceNumber: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'slf/in/' + argId);
		}, 
		getAll: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'slf/all');
		},
		checkInvoiceNumber: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'slf/checkInvoiceNumber/'+argData.invoice_number+'/'+argData.notin);
		},
		getContainerDetails: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'slf/getContainerDetails/'+argData.container_number);
		},
		updateBulkAssign: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'slf/updateBulkAssign', argData.data); 
		},
		send40DaysEmail: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'slf/send40DaysEmail', argData.data); 
		},
		sendUnholdEmail: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'slf/sendUnholdEmail', argData.data); 
		},
		save: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'slf', argData.data); 
		},
		getSalesAgentsRankings: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'slf/getSalesAgentsRankings', argData.data); 
		}, 
		getByFilters: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'slf/getByFilters', argData.data); 
		}, 
		getByFiltersCredit: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'slf/getByFiltersCredit', argData.data); 
		}, 
		update: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'slf', argData.data); 
		}, 
		delete: function(argData) {
			return $http.delete(appConstants.apiUrlBase + 'slf/'+ argData.id); 
		}, 
	};

	var payment = {
		getOne: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'payment/id/' + argId);
		}, 
		getDeletes: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'payment/getDeletes');
		}, 
		getAllPendings: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'payment/getAllPendings');
		}, 
		getInvoiceDetails: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'payment/getInvoiceDetails/' + argData.invoice_number);
		}, 
		getPendingPayments: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'payment/getPendingPayments/' + argData.get_date + '/'+argData.type);
		}, 
		getByInvoiceNumber: function (argInvoiceNumber) {
			return $http.get(appConstants.apiUrlBase + 'payment/invoiceNumber/' + argInvoiceNumber);
		},
		getRecentSalesMonthWise: function (argInvoiceNumber) {
			return $http.get(appConstants.apiUrlBase + 'payment/getRecentSalesMonthWise');
		},
		save: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'payment', argData.data); 
		}, 
		update: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'payment', argData.data); 
		}, 
		delete: function(argData) {
			return $http.delete(appConstants.apiUrlBase + 'payment/'+ argData.id); 
		}, 
	};

	var containerPayment = {
		getOne: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'containerPayment/id/' + argId);
		}, 
		getDeletes: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'containerPayment/getDeletes');
		}, 
		getPendingPayments: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'containerPayment/getPendingPayments/' + argData.get_date + '/'+argData.type);
		}, 
		getByContainerNumber: function (argContainerNumber) {
			return $http.get(appConstants.apiUrlBase + 'containerPayment/containerNumber/' + argContainerNumber);
		},
		getRecentSalesMonthWise: function (argContainerNumber) {
			return $http.get(appConstants.apiUrlBase + 'containerPayment/getRecentSalesMonthWise');
		},
		save: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'containerPayment', argData.data); 
		}, 
		update: function(argData) {
			return $http.put(appConstants.apiUrlBase + 'containerPayment', argData.data); 
		}, 
		delete: function(argData) {
			return $http.delete(appConstants.apiUrlBase + 'containerPayment/'+ argData.id); 
		}, 
	};

	var dashboard = {
		get: function (argId) {
			return $http.get(appConstants.apiUrlBase + 'd');
		}, 
		get_in_warehouse: function () {
			return $http.get(appConstants.apiUrlBase + 'd/get_in_warehouse');
		}, 
		get_box_descrapencies: function () {
			return $http.get(appConstants.apiUrlBase + 'd/get_box_descrapencies');
		}, 
		save: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'd', argData.data); 
		}, 
		update: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'd', argData.data); 
		}, 
		delete: function(argData) {
			return $http.delete(appConstants.apiUrlBase + 'd/'+ argData.id); 
		}, 
	};
	
	var boxStatus = {
	    getBoxesForTrackingAndImages: function () {
			return $http.get(appConstants.apiUrlBase + 'bt/getBoxesForTrackingAndImages');
		}, 
		getBoxStatusSalesAgent: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'bt/getBoxStatusSalesAgent/'+argData.sales_agent_id);
		}, 
		getBoxStatusByInvoiceNumber: function (argData) {
			return $http.get(appConstants.apiUrlBase + 'bt/getBoxStatusByInvoiceNumber/'+argData.invoice_number);
		}, 
		getBoxStatusForUpdaterNotTodaysForReview: function () {
			return $http.get(appConstants.apiUrlBase + 'bt/getBoxStatusForUpdaterNotTodays/1');
		}, 
	    getBoxStatusForUpdaterNotTodays: function () {
			return $http.get(appConstants.apiUrlBase + 'bt/getBoxStatusForUpdaterNotTodays');
		}, 
	    getBoxStatusForUpdaterTodays: function () {
			return $http.get(appConstants.apiUrlBase + 'bt/getBoxStatusForUpdaterTodays');
		},
		getExistingBoxStatusByTrackingNumber: function(argTrackingNumber) {
		   return $http.get(appConstants.apiUrlBase + 'bt/getExistingBoxStatusByTrackingNumber/' + argTrackingNumber);  
		},
		getExistingBoxStatusById: function(argId) {
		   return $http.get(appConstants.apiUrlBase + 'bt/getExistingBoxStatusById/' + argId);  
		},
	    saveBoxStatus: function(argData) {
			return $http.post(appConstants.apiUrlBase + 'bt/boxStatus', argData.data); 
		}, 
	};
	
	var user = {
	    saveStaffPayroll: function(argData) {
	        return $http.post(appConstants.apiUrlBase + 'users/saveStaffPayroll', argData);
	    },
	    getStaffPayroll: function(argData) {
	        return $http.get(appConstants.apiUrlBase + 'users/getStaffPayroll/' + argData.staff_id + '/' + argData.payroll_date);
	    },
	    getStaffPayroll: function(argData) {
	        return $http.get(appConstants.apiUrlBase + 'users/getStaffPayroll/' + argData.staff_id + '/' + argData.payroll_date);
	    },
	    deactivateUser: function(argData) {
	        return $http.post(appConstants.apiUrlBase + 'users/deactivateUser', argData);
	    }
	};

	return {
		master: master,
		firm: firm,
		bt: bt,
		payment: payment,
		dashboard: dashboard,
		slf: slf,
		containerPayment: containerPayment,
		boxStatus: boxStatus,
		user: user
	};
}]);