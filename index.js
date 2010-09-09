// schema.js - index - Copyright Andreas Kalsch <andreaskalsch@gmx.de> (MIT Licensed)

 
 

"use strict";
var sys = require('sys');
require('extensions');




var LANG = 'de';




function _Error (path, name, message) {

	this.path = path
		? path.clone()
		: [];
	this.name = name || '';
	this.message = message || '';
};

_Error.prototype = new Error;
_Error.prototype.constructor = _Error;




function Validation (rootSchema, instance) {

	this.id = ++Validation._id;

	// Save combination of objects/schemas	
	this._flags = {};

	this._wasError = 0;
	
	// Stack of schemas
	this._stack = [];
	this.push(rootSchema);
	
	// Current path
	this.path = [];
	
	/// Relevant?
	this.rootSchema = rootSchema;
	
	// Both relevant properties the user is interested in
	this.errors = [];
	this.instance = instance;
	this.instance = this.start(instance);
	
	delete this._flags, this._wasError, this._stack;
};

Object.extend(Validation.prototype, {


	// change state

	pushError: function (name, message) {
	
		/*message = message 
			|| Schema.messages[name]
				? (
					Schema.messages[name][Schema.LANG || LANG]
						|| Schema.messages[name].en
				).call(this)
				: '';*/
	
		this.errors.push(new _Error(this.path, name, message));
		this._wasError++;
	},
	
	wasError: function () {
	
		var was = this._wasError;
		this._wasError = 0;
		return was;
	},
	
	isError: function () {
	
		return this.errors.length > 0;
	},
	
	push: function (schema, key) {
	
		this.schema = schema;
		this._stack.push(schema);
		if (key !== undefined) this.path.push(key);
	},
	
	pop: function (omitKey) {
	
		var ret = [
			this._stack.pop(),
			omitKey ? undefined : this.path.pop()
		];
		var len = this._stack.length;
		this.schema = len 
			? this._stack[len - 1]
			: null;
		return ret;
	},
	
	getFlag: function (instance) {
	
		return Object.id(instance)+'_'+this.schema.id;
	},
	
	flagObject: function (instance) {
	
		this._flags[this.getFlag(instance)] = true;
		return instance;
	},
	
	isObjectFlagged: function (instance) {
	
		return this.getFlag(instance) in this._flags;
	},
	
	
	
	// start
	
	start: function (instance) {
	
		if (instance instanceof Object) {
		
			if (this.isObjectFlagged(instance)) return instance;
			this.flagObject(instance);
		}
		
		instance = this.extends(instance); if (this.wasError()) return instance;

		instance = this.optional(instance); if (this.wasError() || instance === undefined) return instance;
		
		instance = this.adapters(instance); if (this.wasError()) return instance;
		
		instance = this.type(instance); if (this.wasError()) return instance;
		
		instance = this.requires(instance);
		
		return instance;
	},
	
	
	// checkers
	
	extends: function (instance) {
	
		if (!this.schema.extends) return instance;
		
		this.push(this.schema.extends);
		instance = this.start(instance);
		this.pop(true);
		
		return instance;
	},
	
	optional: function (instance) {

		return (this.schema.optional || instance !== undefined)
			? instance
			: this.schema.__optional.call(this, instance);
	},
		
	adapters: function (instance) {
	
		if (!this.schema.adapters) return instance;
		
		
		var adapters = this.schema.adapters;
		
		if (!(adapters instanceof Array)) {

			return (typeof adapters === 'string' 
				? Schema.plugins[adapters]
				: adapters).call(this, instance);
		}
			

		var len = this.errors.length,
			adapter;
		for (var li = adapters.length, i = 0; i < li; i++) {
				
			adapter = adapters[i];
				
			instance = (typeof adapter === 'string'
				? Schema.plugins[adapter]
				: adapter).call(this, instance);
				
			if (this.errors.length > len) return instance;
		}
		
		return instance;
	},
	
	type: function (instance, type, isFirst) {
		
		isFirst = isFirst === false
			? false
			: true;
		
		var toType = type || this.schema.type;
		
		if (!(toType instanceof Array)) {
	
			var fromType = typeof instance;
			
			var ok = (function () {
			
				if (toType === 'any') return true;
			
				if (toType === 'null') return instance === null;
				
				if (toType === 'array') return instance instanceof Array;
				
				if (toType === 'object') return instance instanceof Object && !(instance instanceof Array);
				
				if (toType === 'number') return fromType === 'number';
				
				if (toType === 'integer') return Math.round(instance) === instance;
				
				if (toType === 'string') return fromType === 'string';
				
				if (toType === 'boolean') return fromType === 'boolean';
			})();
				
			if (!ok) {

				instance = this.schema.__type.call(this, instance); if (this.wasError()) return instance;
			}
				
			var type = typeof instance;

			if (type === 'number') {
			
				instance = this.minimum(instance); if (this.wasError()) return instance;
				
				instance = this.maximum(instance); if (this.wasError()) return instance;
			
				instance = this.maxDecimal(instance); if (this.wasError()) return instance;
				
				if (isFirst) instance = this.enum(instance);
				
				return instance;
			}
			
			if (type === 'string') {
			
				instance = this.pattern(instance); if (this.wasError()) return instance;
				
				instance = this.minLength(instance); if (this.wasError()) return instance;
				
				instance = this.maxLength(instance); if (this.wasError()) return instance;
				
				if (isFirst) instance = this.enum(instance);
				
				return instance;
			}
			
			if (instance instanceof Array) {
			
				instance = this.minItems(instance); if (this.wasError()) return instance;
				
				instance = this.maxItems(instance); if (this.wasError()) return instance;
				
				instance = this.items(instance); if (this.wasError()) return instance;

				instance = this.additionalProperties(instance); if (this.wasError()) return instance;
				
				if (isFirst) instance = this.enum(instance);
				
				return instance;
			}
			
			if (instance instanceof Object) {
			
				instance = this.properties(instance);
				
				instance = this.additionalProperties(instance); if (this.wasError()) return instance;
				
				if (isFirst) instance = this.enum(instance);
				
				return instance;
			}
			
			return instance;
		}
		else {

			var inst,
				len = this.errors.length;
			for (var li = toType.length, i = 0; i < li; i++) {
		
				inst = this.type(instance, toType[i], i === 0);
				if (this.errors.length === len) {
				
					instance = inst;
					break;
				}
				
				
				if (i + 1 < li) {
				
					this.errors.splice(len);
					this.wasError();
				}
			}
		}
		
		return instance;
	},
	
	enum: function (instance) {
		
		if ('enum' in this.schema) {
		
			/// Tolerant ?
			return this.schema.enum.indexOf(instance) > -1 
				? instance
				: this.schema.__enum.call(this, instance);
		}
		
		return instance;
	},
	
	requires: function (instance) {
		
		if (this.schema.requires !== undefined
			&& this.parentInstance) {

			/// requires as string will be replaces by schem, like this:
			var tempSchema;
			if (typeof this.schema.requires === 'string') {
			
				tempSchema = {
				
					properties: {}
				};
				tempSchema.properties[this.schema.requires] = new Schema({type:'any'});
			}
			else {
			
				tempSchema = {
			
					properties: this.schema.requires
				};
			}
			
			var schema_key = this.pop();
			
			this.push(tempSchema);

			this.properties(this.parentInstance);
			
			this.pop(true);
			this.push.apply(this, schema_key);
		}
		
		return instance;
	},
	
	properties: function (instance) {
	
		if ('properties' in this.schema) {
	
			var props = this.schema.properties,
				prop,
				inst;
			
			this.parentInstance = instance;

			var isIn, inst;
			for (var key in props) {

				this.push(props[key], key);
				isIn = key in instance;
				inst = this.start(instance[key]);
				
				if (isIn || inst !== undefined) instance[key] = inst;
				this.pop();
			}
			
			this.parentInstance = null;
		}
		
		this.wasError();
		return instance;
	},
	
	additionalProperties: function (instance) {
	
		if ('additionalProperties' in this.schema) {
	
			if (instance instanceof Object && !(instance instanceof Array)) {
			
				var props = this.schema.properties || {};
		
				if (!this.schema.additionalProperties) {
					
					for (var ks = Object.keys(
						instance
					), li = ks.length, i = 0, key; key = ks[i], i < li; i++) {
		
						if (!(key in props)) {
						
							return this.schema.__additionalProperties.call(this, instance);
						}
					}
				}
				else if (this.schema.additionalProperties !== true) {
								
					for (var ks = Object.keys(
						instance
					), li = ks.length, i = 0, key; key = ks[i], i < li; i++) {
		
						if (!(key in props)) {
						
							this.push(this.schema.additionalProperties, key);
							instance[key] = this.start(instance[key]);
							this.pop();
						}
					}
				}
			}
			else if (this.schema.items instanceof Array) {

				if (!this.schema.additionalProperties) {
					
					if (instance.length > this.schema.items.length) {
					
						return this.schema.__additionalProperties.call(this, instance);
					}
				}
				else if (this.schema.additionalProperties !== true) {
					
					for (var li = instance.length, i = this.schema.items.length; i < li; i++) {
		
						this.push(this.schema.additionalProperties, i);
						instance[i] = this.start(instance[i]);
						this.pop();
					}
				}
			}
		}
		
		return instance;
	},
	
	items: function (instance) {
	
		if ('items' in this.schema) {
		
			if (this.schema.items instanceof Array) {
			
				var isIn, inst;
				for (var li = this.schema.items.length, i = 0; i < li; i++) {
				
					this.push(this.schema.items[i], i);
					isIn = i in instance;
					inst = this.start(instance[i]);
					if (isIn || inst !== undefined) instance[i] = inst;
					this.pop();
				}
			}
			else {
			
				for (var li = instance.length, i = 0; i < li; i++) {
				
					this.push(this.schema.items, i);
					instance[i] = this.start(instance[i]);
					this.pop();
				}
			}
		}
		
		return instance;
	},
	
	maxItems: function (instance) {
	
		return this.schema.maxItems && instance.length > this.schema.maxItems
			? this.schema.__maxItems.call(this, instance)
			: instance;
	},
	
	minItems: function (instance) {
	
		return this.schema.minItems && instance.length < this.schema.minItems
			? this.schema.__minItems.call(this, instance)
			: instance;
	},
	
	minimum: function (instance) {
	
		if (!('minimum' in this.schema)) return instance;
	
	
		var minimumCanEqual = 'minimumCanEqual' in this.schema
			? this.schema.minimumCanEqual
			: true;
		return (minimumCanEqual
			? instance >= this.schema.minimum
			: instance > this.schema.minimum
		)
			? instance
			: this.schema.__minimum.call(this, instance);
	},
	
	maximum: function (instance) {
	
		if (!('maximum' in this.schema)) return instance;
	
	
		var maximumCanEqual = 'maximumCanEqual' in this.schema
			? this.schema.maximumCanEqual
			: true;
		return (maximumCanEqual
			? instance <= this.schema.maximum
			: instance < this.schema.maximum
		)
			? instance
			: this.schema.__maximum.call(this, instance);
	},
	
	maxDecimal: function (instance) {
	
		if ('maxDecimal' in this.schema) {
		
			var factor = Math.pow(10, this.schema.maxDecimal);
			return Math.round(instance * factor) / factor === instance
				? instance
				: this.schema.__maxDecimal.call(this, instance);
		}
		
		return instance;
	},
	
	pattern: function (instance) {
	
		if (!this.schema.pattern) return instance;
		
		return this.schema.pattern.test(instance)
			? instance
			: this.schema.__pattern.call(this, instance);
	},
	
	minLength: function (instance) {
	
		if (this.schema.minLength === undefined) return instance;

		return instance.length >= this.schema.minLength
			? instance
			: this.schema.__minLength.call(this, instance);
	},
	
	maxLength: function (instance) {
	
		if (this.schema.maxLength === undefined) return instance;
	
		return instance.length <= this.schema.maxLength
			? instance
			: this.schema.__maxLength.call(this, instance);
	}
});

Object.extend(Validation, {

	_id: 0,
	Error: _Error
});




function Schema (rawSchema) {
		
	if (typeof rawSchema === 'string') rawSchema = JSON.parse(rawSchema);

	if (rawSchema instanceof Schema) return rawSchema;
	
	
	Object.extend(this, rawSchema);
	
	var id = typeof this.id === 'string'
		? this.id
		: '__'+(++Schema._id);
	this.constructor.instances[id] = this;
};

Object.extend(Schema.prototype, {

	validate: function (instance) {
	
		return new Validation(this, instance);
	},

	setFallbacks: function (obj) {
	
		var adapterName;
	
		for (var propertyName in obj) {
	
			adapterName = obj[propertyName];
	
			if (!(adapterName in Schema.plugins)) throw 'Fallback not registered!';
	
	
			this['__'+propertyName] = Schema.plugins[adapterName](propertyName);
		}
		
		return this;
	}
});
	
Object.extend(Schema, {

	_id: 0,

	create: function (rawSchema) {
	
		var validation = Schema.instances.jsonSchemaCore.validate(rawSchema);
		if (validation.isError()) {
		
			var E = new Error('Invalid schema');
			E.validation = validation
			throw E;
		}
		
		return validation.instance;
	},
	
	createSeveral: function (schemaDict) {
	
		for (var key in schemaDict) {
		
			if (schemaDict[key].id === undefined) schemaDict[key].id = key;
			
			
			schemaDict[key] = this.create(schemaDict[key]);
		}
		
		return schemaDict;
	},

	instances: {},

	Validation: Validation,
	
	resolveRefs: function () {
	
		for (var id in this.instances) {

			Object.resolveRefs(this.instances[id], true);
		}
	},

	plugins: {},
	
	messages: {
		
		type: {
		
			de: function () {

				//return 'Dieser Wert muss vom Typ %s sein.'.sprintf(Schema.instances.jsonSchemaCore.properties.type.labels[this.schema.type].de);
			}
		}
	},
	
	TOLERANT_FALLBACKS: {

		optional: 'setDefault',
		type: 'castTolerantlyToType',
		enum: 'setDefault',
		requires: 'pushError',
		additionalProperties: 'removeAdditionalProperties',
		maxItems: 'sliceToMaxItems',
		minItems: 'pushError',
		maximum: 'setMaximum',
		minimum: 'setMinimum',
		maxDecimal: 'roundToMaxDecimal',
		pattern: 'pushError',
		minLength: 'pushError',
		maxLength: 'pushError'
	},
	
	STRICT_FALLBACKS: {
	
		optional: 'pushError',
		type: 'pushError',
		enum: 'pushError',
		requires: 'pushError',
		additionalProperties: 'pushError',
		maxItems: 'pushError',
		minItems: 'pushError',
		maximum: 'pushError',
		minimum: 'pushError',
		maxDecimal: 'pushError',
		pattern: 'pushError',
		minLength: 'pushError',
		maxLength: 'pushError'
	}
});

Object.extend(Schema.plugins, require('./plugins/default'));

Schema.prototype.setFallbacks(Schema.TOLERANT_FALLBACKS);

Object.extend(Schema.plugins, {


	// adapters - for the core schema
	
	addToRefs: function (instance) {

		if (instance instanceof Object
			&& typeof instance.$ref === 'string') {

			/// Still no URIs supported
			var toPath = this.path,
				fromPath = instance.$ref.split('.');
			
			Object.addRef(
				this.instance,
				toPath.clone(),
				fromPath[0] === '#'
					? fromPath.clone()
					: ['__Schema', 'instances'].concat(fromPath)
			);
		}
		
		return instance;
	},
	
	instantiateSchema: function (instance) {
		
		if (instance instanceof Schema || !(instance instanceof Object)) return instance;
		
		
		var isThisInstance = instance === this.instance;
		instance = new Schema(instance);
		if (isThisInstance) this.instance = instance;
		
		if (instance.properties instanceof Object) {

			var props = instance.properties || {};

			for (var key in props) {
		
				if (props[key] instanceof Object && !(props[key] instanceof Schema))
					props[key] = new Schema(props[key]);
			}
		}
		
		if (instance.items instanceof Array) {
		
			var items = instance.items;
			for (var li = items.length, i = 0; i < li; i++) {
		
				if (items[i] instanceof Object && !(items[i] instanceof Schema))
					items[i] = new Schema(items[i]);
			}
		}
		else if (instance.items instanceof Object) {
		
			if (!(instance.items instanceof Schema))
				instance.items = new Schema(instance.items);
		}
		
		if (instance.requires 
			&& instance.requires instanceof Object
			&& !(instance.requires instanceof Schema)) {
		
			instance.requires = new Schema(instance.requires);
		}
		
		if (instance.additionalProperties instanceof Object
			&& !(instance.additionalProperties instanceof Schema)) {
		
			instance.additionalProperties = new Schema(instance.additionalProperties);
		}
		
		if (instance.extends instanceof Object) {

			if (!(instance.extends instanceof Schema)) {
			
				instance.extends = new Schema(instance.extends);
			}
		}
		
		if (instance.fallbacks) {
	
			instance.setFallbacks(instance.fallbacks);
			delete instance.fallbacks;
		}
		
		Object.resetRefs(instance);
		
		return instance;
	}
});




var jsonSchemaCore = require('./schemas/jsonSchemaCore');

/* The schema schema cannot validate/adapt itself after having been instantiated from raw JSON.
 * At first we apply all adaptations manually, including:
 * - instantiating (sub)schemas
 * - resolve references
 * - set fallbacks (strict)
 * - eventually make extends change the parent schema
 */

jsonSchemaCore = new Schema(jsonSchemaCore);
jsonSchemaCore.setFallbacks(Schema.STRICT_FALLBACKS);

for (var key in jsonSchemaCore.properties) {

	jsonSchemaCore.properties[key] = new Schema(jsonSchemaCore.properties[key]);
	jsonSchemaCore.properties[key].setFallbacks(Schema.STRICT_FALLBACKS);
}

jsonSchemaCore.properties.type.items = new Schema(jsonSchemaCore.properties.type.items);
jsonSchemaCore.properties.type.items.setFallbacks(Schema.STRICT_FALLBACKS);
jsonSchemaCore.properties.type.items.enum = jsonSchemaCore.properties.type.enum;

jsonSchemaCore.properties.id.pattern = new RegExp(jsonSchemaCore.properties.id.pattern);

jsonSchemaCore.properties.options.items = new Schema(jsonSchemaCore.properties.options.items);
jsonSchemaCore.properties.options.items.setFallbacks(Schema.STRICT_FALLBACKS);

jsonSchemaCore.properties.requires.properties = jsonSchemaCore.properties;

jsonSchemaCore.properties.adapters.items = new Schema(jsonSchemaCore.properties.adapters.items);
jsonSchemaCore.properties.adapters.items.setFallbacks(Schema.STRICT_FALLBACKS);

jsonSchemaCore.properties.fallbacks.additionalProperties = new Schema(jsonSchemaCore.properties.fallbacks.additionalProperties);
jsonSchemaCore.properties.fallbacks.additionalProperties.setFallbacks(Schema.STRICT_FALLBACKS);

jsonSchemaCore.properties.properties.additionalProperties = jsonSchemaCore;

//Luhmannesk moment
//jsonSchemaCore.properties.extends.extends = jsonSchemaCore;

jsonSchemaCore.properties.items.properties = jsonSchemaCore.properties;
jsonSchemaCore.properties.items.items = jsonSchemaCore;

jsonSchemaCore.properties.additionalProperties.properties = jsonSchemaCore.properties;

/* Now, the core schema should be as if it had validated itself.
 * Check it out:
 */

var validation = jsonSchemaCore.validate(jsonSchemaCore);

if (validation.isError()) {

	sys.puts('The core schema is not valid!');
	validation.errors.forEach(function (error) {
	
		sys.puts(sys.inspect(error));
	});
	sys.puts(sys.inspect(validation));
}




global.__Schema = module.exports = Schema;