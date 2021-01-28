app.service('frontEndData', [function () {
	return {
		category: [
			{ id: 'f',  text: 'Forwarders' },
			{ id: 'bs', text: 'Box Status' },
			{ id: 'd',  text: 'Destinations' },
			{ id: 'p',  text: 'Ports' },
			{ id: 'pt', text: 'Package Types' },
			{ id: 'pm', text: 'Payment Modes' },
		]
	};
}]);