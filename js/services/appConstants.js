app.service('appConstants', ['$location', function ($location) {
	return {
		// User Related
		userInfo: {},

		// Product Related
		gst: 5,
		hsnCode: '',
		dateFormat: 'DD-MM-YYYY', 
		prepandInvZeroes: 6,
		printNumberPS: 1,
		printNumberPSSize: 'A4/2',
		printNumberInvoice: 2,
		printNumberInvoiceSize: 'A4',
		printNumberLR: 2,
		printNumberLRSize: 'A4',
		printNumberEWay: 1,
		printNumberEWaySize: 'A4',
		defaultOptionText: '- Select an Option -',
		toastConfig: {
      hideDelay   		: 3000,
      position    		: 'top right',
      templateUrl 		: 'dist/views/templates/toast-template.html',
      defaultType			: 'info',
      bindToController: true,
      controllerAs		: 'toast',
      controller 			: function () {
				var self = this;
			}
		},
		templateUrl: 'dist/views/templates/',

		apiUrlBase: $location.host().indexOf('localhost') >= 0 ? 
								// $location.protocol() + "://" + $location.host() + ":" + $location.port() + 'logistics/bcks/src/public/' :		
								'http://localhost/logistics/bcks/src/public/' :		
								'http://www.cotabato-express.com/bcks/src/public/',
		
    dbDateFormat: 'YYYY-MM-DD',
    showDateFormat: 'DD-MM-YYYY' 		
	};
}]);