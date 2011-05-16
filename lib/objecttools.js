/* objecttools
 * 
 * JavaScript Object and JSON reference utilities
 * Copyright 2011 Andreas Kalsch
 */




// Check builtins

if (typeof global === 'undefined' && typeof window === 'object')
	window.global = window

if (!Object.keys)
	Object.keys = function(obj) {
		if (obj !== Object(obj))
			throw new TypeError('Invalid object');

		
		var keys = []
		for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key
		return keys
	}




var __id = 0,
	specialObjectKeys = ['$ref', '$refs', '$$refs'],
	objecttools = {}


/**
 * Find a property in object by path or return undefined
 */
var find = objecttools.find = function (object, path) {
		
	var key,
		obj = object
	for (var li = path.length, i = 0; i < li; i++) {

		if ((key = path[i]) === undefined)
			break;
	
	
		if (
			(obj instanceof Object || obj instanceof Array)
			&& key in obj
		)
			obj = obj[key]
		else
			return;
	}

	return obj;
}


/**
 * Add (if not yet existing) and return a global-ly unique object ID
 */
var id = objecttools.id = Object.defineProperty
	? function (object) {
	
		if (!(object instanceof Object))
			return;


		if (!object.hasOwnProperty('__id')) {
	
			Object.defineProperty(object, '__id', {
				value: __id++,
				enumerable: false
			})
		}
	
		return object.__id
	}
	: function (object) {
	
		if (!(object instanceof Object))
			return;


		if (!object.hasOwnProperty('__id')) {

			object.__id = __id++
		}
	
		return object.__id
	}


/**
 * Resets and returns object.$refs
 */
var resetRefs = objecttools.resetRefs = function (object) {

	if (!(object instanceof Object))
		return null;


	var refs = getRefs(object)
	if (refs) {

		refs.splice(0)
		return refs;
	}

	refs = []
	if (object instanceof Array) {

		object.push({ $$refs: refs })
	}
	else {

		object.$refs = refs
	}

	return refs;
}


/**
 * Returns object.$refs if existing, else null
 */
var getRefs = objecttools.getRefs = function (object) {

	if (!(object instanceof Object))
		return null;


	if (object instanceof Array) {

		if (
			object[object.length - 1]
			&& object[object.length - 1].$$refs instanceof Array
		)
			return object[object.length - 1].$$refs;
	}


	if (object.hasOwnProperty('$refs'))
		return object.$refs;


	return null;
}


/**
 * Adds a new to/from reference to object.$refs
 * The object must habe been initialized with resetRefs(object)
 * fromPath can start with '#' or 'inGlobalNamespace'
 * Returns object.$refs
 */
var addRef = objecttools.addRef = function (object, toPath, fromPath) {

	var refs = getRefs(object)

	if (!refs)
		throw new Error('You need to call resetRefs(object) first!')


	refs.push(toPath)
	refs.push(fromPath)

	return refs
}


/**
 * Populate object.$refs with all redundant references included in object
 * Returns object
 */
var findRefs = objecttools.findRefs = function (object) {

	var fromPathById = {},
		toPath = [],
		refs = resetRefs(object)


	var self = function (obj) {

		if (!(obj instanceof Object))
			return
	

		var _id = id(obj)
		if (fromPathById[_id] !== undefined) {
	
			refs.push([].concat(toPath))
			refs.push(fromPathById[_id])
		
			/// ? (Server only)
			/*
			if (!object.hasOwnProperty('$omit')) 
				Object.defineProperty(object, '$omit', {
					value: {},
					enumerable: false
				})
			object.$omit[toPath[toPath.length - 1]] = true
			*/
		
			return;
		}
	
		fromPathById[_id] = ['#'].concat(toPath)
	
		if (object instanceof Array) {
	
			for (var li = object.length, i = 0; i < li; i++) {
		
				toPath.push(i)
				self(obj[i])
				toPath.pop()
			}
		
			return;
		}

		for (var ks = Object.keys(
			obj
		), li = ks.length, i = 0, key; key = ks[i], i < li; i++) {
	
			if (specialObjectKeys.indexOf(key) > -1)
				continue;
		
	
			toPath.push(key)
			self(obj[key])
			toPath.pop()
		}
	}

	self(object)

	return object;
}


/**
 * Resolve as object.$refs as possible and remove resolved ones from object.$refs
 * If you are sure that $refs comes from a trusted source, set isTrustedSource = true
 * to include global based references
 * Returns object
 */
var resolveRefs = objecttools.resolveRefs = function (object, isTrustedSource) {
	
	var refs,
		isArray = object instanceof Array
	
	if (isArray) {
	
		var last = object[object.length - 1]
		if (
			last instanceof Object
			&& last.$refs instanceof Array
		)
			refs = last.$refs
	}
	else if (
		object instanceof Object
		&& object.$refs instanceof Array
	)
		refs = object.$refs

	if (!refs)
		return object;


	var to, to_last,
		from, from_first,
		obj
	
	for (var li = refs.length, i = 0; i < li; i += 2) {

		to = [].concat(refs[i])
		from = [].concat(refs[i + 1])

		to_last = to.pop()
		from_first = from.shift()
		if (to_last === undefined || from_first === undefined)
			continue;
	
	
		obj = find(object, to)
		if (!obj)
			continue;


		if (from_first !== '#')
			from.unshift(from_first)
	
		if (from_first !== '#' && !isTrustedSource)
			continue;
			
	
		obj[to_last] = find(
			from_first === '#'
				? object
				: global,
			from
		)
		
		refs.splice(i, 2)
		i -= 2; li -= 2
	}

	return object;
}


if (typeof module === 'object' && module.exports)
	module.exports = objecttools
