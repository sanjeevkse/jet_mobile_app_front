Object.cust_filter = function( obj, predicate) {
    var result = {}, key;
    // ---------------^---- as noted by @CMS, 
    //      always declare variables with the "var" keyword

    for (key in obj) {
        if (obj.hasOwnProperty(key) && predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};