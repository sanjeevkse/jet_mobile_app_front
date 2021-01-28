'use strict';

/* Filters */
app.filter('prepandZeroes', ['appConstants', function(appConstants) {
  return function (value) {
		if (value &&  value.toString().length < appConstants.prepandInvZeroes) {
			return ('000000' + value).slice(-appConstants.prepandInvZeroes);
		}
    return value;
	}
}]);

app.filter('stringConcat', function () {
   return function (input, delimiter) {
     if (input) {
       return input.join(delimiter)
     }
     else {
       return '';
     }
   };
 });

app.filter('sum', function () {
   return function (inputArray) {
     if (inputArray) {
       var total = 0;
       angular.forEach(inputArray, function(v) {
         total += v * 1;
       });
       return total;
     } else {
       return 0;
     }
   };
 });

app.filter('momentFltr', function(){
  return function(argDateTime, argFromPattern = 'YYYY-MM-DD HH:mm:ss', argToPattern = 'YYYY-MM-DD HH:mm:ss'){
  	// console.log('a', argDateTime);
  	if(!!argDateTime) {
	    if(argFromPattern == 'moment') {
	      return moment(argDateTime).format(argToPattern);
	    } else {
	      return moment(argDateTime, argFromPattern).format(argToPattern);
	    }
	  }
	  return '';
  }
});

app.filter('INR', function () {        
  return function (input, needSign) {
    if (! isNaN(input) && input!==null && input) {
      var currencySymbol = '₹ ';
      //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
      var result = input.toString().split('.');

      var lastThree = result[0].substring(result[0].length - 3);
      var otherNumbers = result[0].substring(0, result[0].length - 3);
      if (otherNumbers != '')
         lastThree = ',' + lastThree;
      var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      
      if (result.length > 1) {
        output += "." + result[1];
      } else {
        output += ".00";
      }

      return needSign ? currencySymbol + output : output;
    } else {
      return input;
    }
  }
});

app.filter('sumByKey', function() {
  return function(data, key) {
    if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
      return 0;
    }

    var sum = 0;
    for (var i = data.length - 1; i >= 0; i--) {
      sum += data[i][key] ? data[i][key] * 1 : 0;
    }
    sum = sum.toFixed(2);
    sum = sum * 1;
    return sum;
  };
});

app.filter('sumByKeyKey', function() {
  return function(data, key1, key2) {
    if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
      return 0;
    }

    var sum = 0;
    for (var i = data.length - 1; i >= 0; i--) {
      sum += data[i][key1][key2] ? data[i][key1][key2] * 1 : 0;
    }
    sum = sum.toFixed(2);
    sum = sum * 1;
    return sum;
  };
});

app.filter('diffDates', function() {
    return function(fromDate, toDate) {
        if(fromDate && toDate) {
            return moment(toDate, 'YYYY-MM-DD').diff(moment(fromDate, 'YYYY-MM-DD'), 'days');
        } else {
            return '';
        }
    }
});