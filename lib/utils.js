// Check for natives, define basic utilities




var slice = Array.prototype.slice,
	hasOwnProperty = Object.hasOwnProperty




// From underscore ( http://documentcloud.github.com/underscore/ )

if (!Object.keys)
	Object.keys = function(obj) {
		if (obj !== Object(obj))
			throw new Error('Invalid object');

		
		var keys = []
		for (var key in obj)
			if (hasOwnProperty.call(obj, key))
				keys[keys.length] = key
		return keys
	}

exports.extend = function (obj) {
	var args = slice.call(arguments, 1),
		source
	for (var i = 0, ii = args.length; i < ii; i++) {
		source = args[i]
		for (var prop in source) {
			/*if (source[prop] !== void 0) */obj[prop] = source[prop]
		}
	}
	return obj
}


// From underscorex ( http://github.com/akidee/underscorex )

exports.locale = function (obj, locale) {

	if (!(obj instanceof Object))
		return obj;
	
	
	locale = ''+locale || 'en'
	
	if (obj[locale] !== undefined)
		return obj[locale];
	
	
	parts = locale.split('_')
	while (parts.pop()) {
	
		locale = parts.join('_')
		if (obj[locale] !== undefined)
			return obj[locale];
	}
	
	
	return obj.en;
}
