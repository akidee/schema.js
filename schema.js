require('./extensions');
var lib = require('lib');


/* Tolerant value adaptation and validation conforming to JSON Schema, v0.1
 *
 * Supported draft-zyp-json-schema-02
 * Not supported:
 *   5.13 (unqiueItems)
 *   5.20 (format) - validation
 *   5.23 (divisibleBy)
 *   5.24 (disallow)
 *   6 (Hyper Schema)
 * Planned support:
 *   5.25 (extends)
 * Additions:
 *   apply - user defined apply function
 *   fitMinMax - make number fit minimum/maximum, if minimum/maximumCanEqual is not false
 */


function push (array, item) {

	array && array.push(item);
};

function cloneAndPush (array, item) {

	if (array) {
	
		var a = array.clone();
		a.push(item);
		return a;
	}
};

function _Error (path, name) {

	this.path = path || [];
	this.name = name || '';
};

Object.extend(_Error.prototype, Error.prototype);

function _any (value, schema, errors, path) {

	if (value === undefined) {
		
		if (!schema || (!schema.optional && !('default' in schema))) push(errors, new _Error(path, 'optional'));
		if (schema && !schema.optional && 'default' in schema) value = schema['default'];
		return value;
	}
	
	if (schema && 'enum' in schema) {
		
		if (schema.enum.indexOf(value) === -1) { push(errors, new _Error(path, 'enum')); return value; }
	}
};

function _number (value, schema, errors, path, isInt) {

	var v;

	if (!isInt) {
	
		if (value === undefined) {
		
			if (!schema || (!schema.optional && !('default' in schema))) push(errors, new _Error(path, 'optional'));
			if (schema && !schema.optional && 'default' in schema) value = schema['default'];
			return value;
		}
		
	
		if (typeof value !== 'boolean') v = parseFloat(value);
		else if (value === false) v = 0;
		else if (value === true) v = 1;
		
		if (isNaN(v)) { push(errors, new _Error(path, 'cast')); return value; }
	}
	else v = value;
	
	
	if (schema) {
	
		if ('maxDecimal' in schema) {
		
			var factor = Math.pow(10, schema.maxDecimal);
			v = Math[v < 0 ? 'ceil' : 'floor'](v * factor) / factor;
		}
		
		if ('minimum' in schema && (
			schema.minimumCanEqual === false ? v < schema.minimum : v <= schema.minimum
		)) { 
		
			if (schema.fitMinMax && !(schema.minimumCanEqual === false)) v = schema.minimum;
			else push(errors, new _Error(path, 'minimum'));
			return v;
		}
		if ('maximum' in schema && (
			schema.maximumCanEqual === false ? v > schema.maximum : v >= schema.maximum
		)) {

			if (schema.fitMinMax && !(schema.maximumCanEqual === false)) v = schema.maximum;
			else push(errors, new _Error(path, 'maximum'));
			return v;
		}
		
		if ('adapt' in schema) {
		
			v = schema.adapt(v, errors, path);
		}
		
		if ('enum' in schema) {
		
			if (schema.enum.indexOf(v) === -1) { push(errors, new _Error(path, 'enum')); return v; }
		}
	}
	
	return v;
};

function _integer (value, schema, errors, path) {

	if (value === undefined) {
		
		if (!schema || (!schema.optional && !('default' in schema))) push(errors, new _Error(path, 'optional'));
		if (schema && !schema.optional && 'default' in schema) value = schema['default'];
		return value;
	}


	if (typeof value !== 'boolean') v = parseInt(value, 10);
	else if (value === false) v = 0;
	else if (value === true) v = 1;
	if (isNaN(v)) { push(errors, new _Error(path, 'cast')); return value; }
	
	
	return _number(v, schema, errors, path, true);
};

function _boolean (value, schema, errors, path) {

	if (value === undefined) {
		
		if (!schema || (!schema.optional && !('default' in schema))) push(errors, new _Error(path, 'optional'));
		if (schema && !schema.optional && 'default' in schema) value = schema['default'];
		return value;
	}
	

	var v,
		type = typeof value;

	if (type === 'string') {
	
		if (value.trim().toLowerCase() === 'false') v = false;
		else {
		
			v = parseFloat(value);
			v = isNaN(v) ? true : !!v;
		}
	}
	else if (type === 'object') {
	
		push(errors, new _Error(path, 'cast'));
		return value;
	}
	else {
	
		v = !!value;
	}
	
	
	if (schema) {
	
		if ('adapt' in schema) {
	
			v = schema.adapt(v, errors, path);
		}
	}
	
	return v;
};

function _string (value, schema, errors, path) {

	if (value === undefined) {
		
		if (!schema || (!schema.optional && !('default' in schema))) push(errors, new _Error(path, 'optional'));
		if (schema && !schema.optional && 'default' in schema) value = schema['default'];
		return value;
	}
	

	var type = typeof value,
		v;
	if (type === 'object') {
	
		if (
			value !== null
			&& typeof value.toString === 'function'
			&& value.toString !== Object.prototype.toString
			&& value.toString !== Array.prototype.toString
		) v = ''+value;
		else { push(errors, new _Error(path, 'cast')); return value; }
	}
	else v = ''+value;


	if (schema) {

		var len = v.length;
		if ('minLength' in schema && len < schema.minLength) { push(errors, new _Error(path, 'minLength')); return v; }
		if ('maxLength' in schema && len > schema.maxLength) { push(errors, new _Error(path, 'maxLength')); return v; }
		
		if ('pattern' in schema) {
		
			if (!schema.pattern.test(v)) { push(errors, new _Error(path, 'pattern')); return v; }
		}
		
		if ('adapt' in schema) {
		
			v = schema.adapt(v, errors, path);
		}
		
		if ('enum' in schema) {
		
			if (schema.enum.indexOf(v) === -1) { push(errors, new _Error(path, 'enum')); return v; }
		}
	}
	
	return v;
};

function _null (value, schema, errors, path) {

	if (!value) return null;
	push(errors, new _Error(path, 'cast'));
	return value;
}

function _object (value, schema, errors, path) {

	path = path || [];
	
	if (value === undefined) {
		
		if (!schema || (!schema.optional && !('default' in schema))) push(errors, new _Error(path, 'optional'));
		if (schema && !schema.optional && 'default' in schema) value = schema['default'];
		return value;
	}

	var v;

	if (value instanceof Array && value.length === 0) v = {};
	else if (typeof value !== 'object' || value === null) { push(errors, new _Error(path, 'cast')); return value; }
	else v = value;
	

	if (v.__adapted) return value;
	Object.defineProperty(v, '__adapted', {enumerable: false, value: true, writable: true});
	
	
	if (schema) {
		
		// extends
		var props = schema.properties || {}, prop, v_, type,
			propKeysWithRequire = {};
		for (var key in props) {
		
			prop = props[key];
			var was = key in v;
			v_ = apply(v[key], prop, errors, cloneAndPush(path, key));
			if (was || !was && v_ !== undefined) v[key] = v_;
			
			if (prop.requires !== undefined) propKeysWithRequire[key] = prop;
		}

		for (var key in propKeysWithRequire) {
		
			prop = propKeysWithRequire[key];

			if (typeof prop.requires === 'string') {
			
				if (v[prop.requires] === undefined) push(errors, new _Error(cloneAndPush(path, prop.requires), 'requires'));
			}
			else {
			
				v.__adapted = false;
				v[key] = apply(v, prop.requires, errors, path);
			}
		}
		
		if ('additionalProperties' in schema) {
		
			var add = schema.additionalProperties;
			for (var key in v) {
			
				if (!(key in props)) {
				
					if (!add) {
					
						//delete v[key];
						push(errors, new _Error(cloneAndPush(path, key), 'additionalProperties'));
					}
					else if (typeof add === 'object') {
					
						v[key] = apply(v[key], add, errors, cloneAndPush(path, key));
					}
				}
			}
		}
		
		if ('adapt' in schema) {
		
			schema.adapt(v, errors, path);
		}
	}
	
	return v;
};

function _array (value, schema, errors, path) {

	path = path || [];
	
	if (value === undefined) {
		
		if (!schema || (!schema.optional && !('default' in schema))) push(errors, new _Error(path, 'optional'));
		if (schema && !schema.optional && 'default' in schema) value = schema['default'];
		return value;
	}
	
	
	if (!value) value = [];
	else if (!(value instanceof Array)) { errors.push(new _Error(path, 'cast')); return value; }
	
	
	if (value.__adapted) return value;
	Object.defineProperty(value, '__adapted', {enumerable: false, value: true, writable: true});

	if (schema) {

		var len = value.length;
		if ('minItems' in schema && len < schema.minItems) { push(errors, new _Error(path, 'minItems')); return value; }
		if ('maxItems' in schema && len > schema.maxItems) { push(errors, new _Error(path, 'maxItems')); return value; }
		
		if (schema.items) {
		
			var v,
				items = schema.items;
	
			if (items instanceof Array) {
			
				for (var li = items.length, i = 0; i < li; i++) {
			
					v = apply(value[i] || undefined, items[i], errors, cloneAndPush(path, i));
					if (i in value) value[i] = v;
				}


				if ('additionalProperties' in schema) {

					var add = schema.additionalProperties;
					
					for (var li = value.length, i = items.length; i < li; i++) {

						if (!add) {
						
							//delete value[i];
							push(errors, new _Error(cloneAndPush(path, i), 'additionalProperties'));
						}
						else if (typeof add === 'object') {
						
							value[i] = apply(value[i], add, errors, cloneAndPush(path, i));
						}
					}
				}
			}
			else {
			
				for (var i = 0; i < len; i++) {
			
					value[i] = apply(value[i], items, errors, cloneAndPush(path, i));
				}
			}
		}
		
		if ('adapt' in schema) {
		
			schema.adapt(value, errors, path);
		}
	}
	
	return value;
};

function apply (value, schema, errors, path) {

	schema = schema || {};
	schema.type = schema.type || 'any';
	
	if (!(schema.type instanceof Array)) {
	
		return module.exports[schema.type](value, schema, errors, path);
	}
	
	var types = schema.type,
		result,
		errors_;
	for (var li = types.length, i = 0; i < li; i++) {

		errors_ = [];
		result = module.exports[types[i]](value, schema, errors_, path);
		if (!errors_.length) return result;
	}
	for (var i = 0; i < errors._length; i++) errors.push(errors_[i]);
	
	return result;
};


module.exports = function Schema (schema) {

	Object.extend(this, schema);
};

Object.extend(module.exports, {

	push: push,
	cloneAndPush: cloneAndPush,
	Error: _Error,
	any: _any,
	number: _number,
	integer: _integer,
	boolean: _boolean,
	string: _string,
	object: _object,
	array: _array,
	apply: apply
});
module.exports['null'] = _null;

Object.extend(module.exports.prototype, {

	apply: function (value, errors) {

		return apply(value, this, errors);
	},
	
	cover: function (func) {

		var schema = this;
	
		return function () {
		
			var errors = [];
			args = schema.adapt(arguments, errors);
			if (errors.length) {
			
				var E = new Error('Bad arguments');
				E.messages = errors;
				throw E;
			}
			
			return func.apply(this, args);
		};
	}
});