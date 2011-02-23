// schema.js - index - Copyright Andreas Kalsch <andreaskalsch@gmx.de> (MIT Licensed)




i18n = require('./i18n')
var _ = require('underscorex')
require('underscorex/object')(_)




var slice = Array.prototype.slice




function _Error (path, name, message) {

	this.path = path
		? _.clone(path)
		: []
	this.name = name || ''
	this.message = message || ''
}

_Error.prototype = new Error
_Error.prototype.id = function () {

	return [this.path, this.name]
}
_Error.prototype.constructor = _Error




/*Error.prototype.toSimpleString = function () {

	var s = [this.message+':']
	if (this.errors instanceof Array) {

		this.errors.forEach(function (e) {

			s.push("\t"+e.path.join(', ')+': '+e.message)
		})
	}
	return s.join("\n")
};*/




function Validation (rootSchema, instance, options) {

	options = options || {}

	this.id = Validation._id++

	// Save combination of objects/schemas	
	this._flags = {}
	
	// Unique errors
	this._errors = {}

	this._wasError = 0
	
	// Stack of schemas
	this._stack = []
	this.push(rootSchema)
	
	// Current path
	this.path = []
	
	/// Relevant?
	this.rootSchema = rootSchema
	
	this.locale = options.locale || 'en'
	
	// Both relevant properties the user is interested in
	this.errors = []
	this.instance = instance
	this.instance = this.start(instance)
	
	delete this._flags, this._errors, this._wasError, this._stack
}

_.extend(Validation.prototype, {


	// change state

	pushError: function (name, message) {
	
		var id = JSON.stringify(
			_Error.prototype.id.call({path: this.path, name: name})
		)
		if (!(id in this._errors)) {
		
			this._errors[id] = true
	
			this.errors.push(new _Error(
				this.path,
				name,
				message instanceof Object
					? _.locale(message, this.locale)(this)
					: message
			))
		}
		this._wasError++
	},
	
	wasError: function () {
	
		var was = this._wasError
		this._wasError = 0
		return was
	},
	
	isError: function () {
	
		return this.errors.length > 0
	},

	getError: function () {

		var e = new Error(
			_.locale(i18n('validation_error'), this.locale)(this)
		)
		e.errors = this.errors
		return e
	},
	
	push: function (schema, key) {
	
		this.schema = schema
		this._stack.push(schema)
		if (key !== undefined) this.path.push(key)
	},
	
	pop: function (omitKey) {
	
		var ret = [
			this._stack.pop(),
			omitKey ? undefined : this.path.pop()
		]
		var len = this._stack.length
		this.schema = len 
			? this._stack[len - 1]
			: null
		return ret
	},
	
	getFlag: function (instance) {
	
		return _.objectId(instance)+'_'+this.schema.id
	},
	
	flagObject: function (instance) {
	
		this._flags[this.getFlag(instance)] = true
		return instance
	},
	
	isObjectFlagged: function (instance) {
	
		return this.getFlag(instance) in this._flags
	},
	
	callPlugin: function (plugin, instance) {
	
		var args = arguments.length > 2
			? slice.call(arguments, 1)
			: [instance]
	
		if (typeof plugin !== 'function')
			plugin = Validation.plugins[plugin] || Validation.plugins.pushError
		return plugin.apply(this, args)
	},
	
	
	
	// start
	
	start: function (instance) {

		if (instance instanceof Object) {
		
			if (this.isObjectFlagged(instance)) return instance
			
			
			this.flagObject(instance)
		}

		instance = this.extends(instance); if (this.wasError()) return instance
		
		instance = this.adapters(instance, 'pre'); if (this.wasError()) return instance

		instance = this.optional(instance); if (this.wasError() || instance === undefined) return instance
		
		instance = this.type(instance); if (this.wasError()) return instance
		
		instance = this.requires(instance); if (this.wasError()) return instance

		instance = this.adapters(instance, 'post')
		
		return instance
	},
	
	
	// checkers
	
	extends: function (instance) {
	
		if (!this.schema.extends) return instance
		
		
		this.push(this.schema.extends)
		instance = this.start(instance)
		this.pop(true)
		
		return instance
	},
	
	optional: function (instance) {

		if (this.schema.optional || instance !== undefined) return instance
		
		
		return this.callPlugin(this.schema.fallbacks.optional, instance, 'optional')
	},
		
	adapters: function (instance, position) {
	
		if (!this.schema[position]) return instance
		
		
		var adapters = this.schema[position]
		
		if (!(adapters instanceof Array)) adapters = [adapters]

		var len = this.errors.length,
			adapter
		for (var li = adapters.length, i = 0; i < li; i++) {
				
			adapter = adapters[i]
				
			instance = this.callPlugin(adapter, instance)
				
			if (this.errors.length > len) return instance
		}
		
		return instance
	},
	
	type: function (instance, type, isFirst) {
		
		isFirst = isFirst === false
			? false
			: true
		
		var toType = type || this.schema.type
		
		if (!(toType instanceof Array)) {
	
			var fromType = typeof instance
			
			var ok = (function () {
			
				if (toType === 'any') return true
			
				if (toType === 'null') return instance === null
				
				if (toType === 'array') return instance instanceof Array// || _.isArguments(instance)
				
				if (toType === 'object') return instance instanceof Object && !(instance instanceof Array)
				
				if (toType === 'number') return fromType === 'number'
				
				if (toType === 'integer') return Math.round(instance) === instance
				
				if (toType === 'string') return fromType === 'string'
				
				if (toType === 'boolean') return fromType === 'boolean'
			})()
				
			if (!ok) {

				instance = this.callPlugin(this.schema.fallbacks.type, instance, 'type')
				if (this.wasError()) return instance
			}
				
			var type = typeof instance

			if (type === 'number') {
			
				instance = this.minimum(instance); if (this.wasError()) return instance
				
				instance = this.maximum(instance); if (this.wasError()) return instance
			
				instance = this.maxDecimal(instance); if (this.wasError()) return instance
				
				if (isFirst) instance = this.enum(instance)
				
				return instance
			}
			
			if (type === 'string') {
			
				instance = this.pattern(instance); if (this.wasError()) return instance
				
				instance = this.minLength(instance); if (this.wasError()) return instance
				
				instance = this.maxLength(instance); if (this.wasError()) return instance
				
				if (isFirst) instance = this.enum(instance)
				
				return instance
			}
			
			if (instance instanceof Array) {
			
				instance = this.minItems(instance); if (this.wasError()) return instance
				
				instance = this.maxItems(instance); if (this.wasError()) return instance
				
				instance = this.items(instance); if (this.wasError()) return instance

				instance = this.additionalProperties(instance); if (this.wasError()) return instance
				
				if (isFirst) instance = this.enum(instance)
				
				return instance
			}
			
			if (instance instanceof Object) {
			
				instance = this.properties(instance)
				
				instance = this.additionalProperties(instance); if (this.wasError()) return instance
				
				if (isFirst) instance = this.enum(instance)
				
				return instance
			}
			
			return instance
		}
		else {

			var inst,
				len = this.errors.length
			for (var li = toType.length, i = 0; i < li; i++) {
		
				inst = this.type(instance, toType[i], i === 0)
				if (this.errors.length === len) {
				
					instance = inst
					break
				}
				
				
				if (i + 1 < li) {

					this.errors.splice(len)
					this.wasError()
				}
			}
		}
		
		return instance
	},
	
	enum: function (instance) {
		
		if ('enum' in this.schema) {
		
			/// Tolerant ?
			return this.schema.enum.indexOf(instance) > -1 
				? instance
				: this.callPlugin(this.schema.fallbacks.enum, instance, 'enum')
		}
		
		return instance
	},
	
	requires: function (instance) {
		
		if (this.schema.requires !== undefined
			&& this.parentInstance) {

			/// requires as string will be replaces by schem, like this:
			var tempSchema
			if (typeof this.schema.requires === 'string') {
			
				tempSchema = {
				
					properties: {}
				}
				tempSchema.properties[this.schema.requires] = {type:'any'}
				
			}
			else {
			
				tempSchema = {
			
					properties: this.schema.requires
				}
			}
			
			tempSchema = Schema.create(tempSchema)
			
			var schema_key = this.pop()
			
			this.push(tempSchema)

			this.properties(this.parentInstance)
			
			this.pop(true)
			this.push.apply(this, schema_key)
		}
		
		return instance
	},
	
	properties: function (instance) {
	
		if ('properties' in this.schema) {
	
			var props = this.schema.properties,
				prop,
				inst
			
			this.parentInstance = instance
			var isIn, inst
			
			for (var key in props) {

				this.push(props[key], key)
				isIn = key in instance
				inst = this.start(instance[key])
				
				if (isIn || inst !== undefined) instance[key] = inst
				this.pop()
			}
			
			this.parentInstance = null
		}
		
		this.wasError()
		return instance
	},
	
	additionalProperties: function (instance) {
	
		if ('additionalProperties' in this.schema) {
	
			if (instance instanceof Object && !(instance instanceof Array)) {
			
				var props = this.schema.properties || {}

				// this.schema.additionalProperties === false ?
				if (!this.schema.additionalProperties) {
					
					for (var ks = _.keys(
						instance
					), li = ks.length, i = 0, key; key = ks[i], i < li; i++) {
		
						if (!(key in props)) {
						
							return this.callPlugin(this.schema.fallbacks.additionalProperties, instance, 'additionalProperties')
						}
					}
				}
				else if (this.schema.additionalProperties !== true) {
								
					for (var ks = _.keys(
						instance
					), li = ks.length, i = 0, key; key = ks[i], i < li; i++) {
		
						if (!(key in props)) {
						
							this.push(this.schema.additionalProperties, key)
							instance[key] = this.start(instance[key])
							this.pop()
						}
					}
				}
			}
			else if (this.schema.items instanceof Array) {

				if (!this.schema.additionalProperties) {
					
					if (instance.length > this.schema.items.length) {
					
						return this.callPlugin(this.schema.fallbacks.additionalProperties, instance, 'additionalProperties')
					}
				}
				else if (this.schema.additionalProperties !== true) {
					
					for (var li = instance.length, i = this.schema.items.length; i < li; i++) {
		
						this.push(this.schema.additionalProperties, i)
						instance[i] = this.start(instance[i])
						this.pop()
					}
				}
			}
		}
		
		return instance
	},
	
	items: function (instance) {
	
		if ('items' in this.schema) {
		
			if (this.schema.items instanceof Array) {
			
				var isIn, inst
				for (var li = this.schema.items.length, i = 0; i < li; i++) {
				
					this.push(this.schema.items[i], i)
					isIn = i in instance
					inst = this.start(instance[i])
					if (isIn || inst !== undefined) instance[i] = inst
					this.pop()
				}
			}
			else {
			
				for (var li = instance.length, i = 0; i < li; i++) {
				
					this.push(this.schema.items, i)
					instance[i] = this.start(instance[i])
					this.pop()
				}
			}
		}
		
		return instance
	},
	
	maxItems: function (instance) {
	
		return this.schema.maxItems && instance.length > this.schema.maxItems
			? this.callPlugin(this.schema.fallbacks.maxItems, instance, 'maxItems')
			: instance
	},
	
	minItems: function (instance) {
	
		return this.schema.minItems && instance.length < this.schema.minItems
			? this.callPlugin(this.schema.fallbacks.minItems, instance, 'minItems')
			: instance
	},
	
	minimum: function (instance) {
	
		if (!('minimum' in this.schema)) return instance
	
	
		var minimumCanEqual = 'minimumCanEqual' in this.schema
			? this.schema.minimumCanEqual
			: true
		return (minimumCanEqual
			? instance >= this.schema.minimum
			: instance > this.schema.minimum
		)
			? instance
			: this.callPlugin(this.schema.fallbacks.minimum, instance, 'minimum')
	},
	
	maximum: function (instance) {
	
		if (!('maximum' in this.schema)) return instance
	
	
		var maximumCanEqual = 'maximumCanEqual' in this.schema
			? this.schema.maximumCanEqual
			: true
		return (maximumCanEqual
			? instance <= this.schema.maximum
			: instance < this.schema.maximum
		)
			? instance
			: this.callPlugin(this.schema.fallbacks.maximum, instance, 'maximum')
	},
	
	maxDecimal: function (instance) {
	
		if ('maxDecimal' in this.schema) {
		
			var factor = Math.pow(10, this.schema.maxDecimal)
			return Math.round(instance * factor) / factor === instance
				? instance
				: this.callPlugin(this.schema.fallbacks.maxDecimal, instance, 'maxDecimal')
		}
		
		return instance
	},
	
	pattern: function (instance) {
	
		if (!this.schema.pattern) return instance
		
		return this.schema.pattern.test(instance)
			? instance
			: this.callPlugin(this.schema.fallbacks.pattern, instance, 'pattern')
	},
	
	minLength: function (instance) {
	
		if (this.schema.minLength === undefined) return instance

		return instance.length >= this.schema.minLength
			? instance
			: this.callPlugin(this.schema.fallbacks.minLength, instance, 'minLength')
	},
	
	maxLength: function (instance) {
	
		if (this.schema.maxLength === undefined) return instance
	
		return instance.length <= this.schema.maxLength
			? instance
			: this.callPlugin(this.schema.fallbacks.maxLength, instance, 'maxLength')
	}
})

_.extend(Validation, {

	_id: 0,
	Error: _Error,
	
	addPlugins: function (plugins) {
	
		_.extend(Validation.plugins, plugins)
	},
	
	plugins: {

		// adapters - for the core schema
		
		addToRefs: function (instance) {
	
			if (instance instanceof Object
				&& !(instance instanceof Array)
				&& typeof instance.$ref === 'string') {
	
				/// Still no URIs supported
				var toPath = this.path,
					fromPath = instance.$ref.split('.')
				
				_.addRef(
					this.instance,
					_.clone(toPath),
					fromPath[0] === '#'
						? _.clone(fromPath)
						: ['#', 'constructor', 'instances'].concat(fromPath)
				)
			}
			
			return instance
		},
		
		instantiateSchema: function (instance) {
			
			if (!(instance instanceof Object) || instance instanceof Array) return instance
			
			
			var isThisInstance = instance === this.instance
			if (!(instance instanceof Schema)) instance = new Schema(instance)
			if (isThisInstance) this.instance = instance
			
			if (instance.properties instanceof Object) {
	
				var props = instance.properties || {}
	
				for (var key in props) {
			
					if (props[key] instanceof Object && !(props[key] instanceof Schema))
						props[key] = new Schema(props[key])
				}
			}
			
			if (instance.items instanceof Array) {
			
				var items = instance.items
				for (var li = items.length, i = 0; i < li; i++) {
			
					if (items[i] instanceof Object && !(items[i] instanceof Schema))
						items[i] = new Schema(items[i])
				}
			}
			else if (instance.items instanceof Object) {
			
				if (!(instance.items instanceof Schema))
					instance.items = new Schema(instance.items)
			}
			
			if (instance.requires 
				&& instance.requires instanceof Object
				&& !(instance.requires instanceof Array)) {
			
				var props = instance.requires
				for (var key in props) {
				
					props[key] = new Schema(props[key])
				}
			}
			
			if (instance.additionalProperties instanceof Object
				&& !(instance.additionalProperties instanceof Schema)) {
			
				instance.additionalProperties = new Schema(instance.additionalProperties)
			}
			
			if (instance.extends instanceof Object) {
	
				if (!(instance.extends instanceof Schema)) {
				
					instance.extends = new Schema(instance.extends)
				}
			}
			
			instance.setFallbacks(instance.fallbacks)
			
			_.resetRefs(instance)
			
			return instance
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
})

Validation.addPlugins(require('./plugins/validation'))




function Schema (rawSchema) {
		
	if (typeof rawSchema === 'string') rawSchema = JSON.parse(rawSchema)

	if (rawSchema instanceof Schema) return rawSchema
	
	
	_.extend(this, rawSchema)
	
	if (this.id === undefined) this.id = ''+Schema._id++
	Schema.instances[this.id] = this
}

_.extend(Schema.prototype, {

	validate: function (instance) {
	
		return new Validation(this, instance)
	},

	setFallbacks: function (fallbacks) {
	
		if (typeof fallbacks === 'string') {
		
			this.fallbacks = Validation[fallbacks]
		}
		else if (fallbacks === undefined) {
		
			this.fallbacks = Validation.TOLERANT_FALLBACKS
		}
		else {
		
			this.fallbacks = _.extend({}, Validation.TOLERANT_FALLBACKS, fallbacks)
		}
		
		return this
	}
})

_.extend(Schema, {

	_id: 0,

	create: function (rawSchema) {

		if (typeof rawSchema === 'string') {
		
			try {

				var json = JSON.parse(rawSchema)
			}
			catch (e) {

				throw new Error('The raw schema cannot be parsed')
			}
		}
	
		var validation = Schema.instances.jsonSchemaCore.validate(rawSchema)
		if (validation.isError()) throw validation.getError()
		

		validation.toJSON = function () {

			return json
		}
		return validation.instance
	},
	
	createSeveral: function (schemaDict) {
	
		/// Collect ALL errors
		for (var key in schemaDict) {
		
			if (schemaDict[key].id === undefined) schemaDict[key].id = key
			
			
			schemaDict[key] = this.create(schemaDict[key])
		}
		
		return schemaDict
	},

	instances: {},

	Validation: Validation,
	
	resolveRefs: function () {
	
		for (var id in this.instances) {

			_.resolveRefs(this.instances[id], true)
		}
	},

	validateCall: function (func, context) {

		if (!(func.SCHEMA instanceof Schema)) throw 'No SCHEMA defined'
		
	
		var v = func.SCHEMA.validate(slice.call(arguments, 2)),
			args = v.instance
		if (v.isError()) throw v.getError()
		
		
		return func.apply(context, args)
	},

	validateCallAsync: function (func, context) {

		if (!(func.SCHEMA instanceof Schema)) throw 'No SCHEMA defined'
		
	
		var args = slice.call(arguments, 2),
			_cb = args.pop(),
			v = func.SCHEMA.validate(args),
			args = v.instance
		if (v.isError()) return _cb(v.getError())
		
		
		args.push(_cb)
		func.apply(context, args)
	},

	/*validateConstruction: function () {}*/

	f: function (schema/* ? */, isValidating/* ? */, isAsync/* ? */, func) {

		var args = slice.call(arguments),
			func = args.pop()

		if (args.length === 0) {

			func.IS_ASYNC = false
			return func
		}
		

		if (schema instanceof Object) {

			var isValidating = !!args[1],
				schema = Schema.create(schema),
				isAsync = !!args[2]

			func.SCHEMA = schema
			func.IS_VALIDATING = isValidating
			func.IS_ASYNC = isAsync

			if (isValidating) {

				var func_ = func

				if (!isAsync)
					func = function () {

						return Schema.validateCall.apply(Schema, [func_, this].concat(slice.call(arguments)))
					}
				else
					func = function () {

						return Schema.validateCallAsync.apply(Schema, [func_, this].concat(slice.call(arguments)))
					}
			}

			func.SCHEMA = schema
			func.IS_VALIDATING = isValidating
			func.IS_ASYNC = isAsync
		}
		else {

			func.IS_ASYNC = !!args[0]
		}

		return func
	}
})




var jsonSchemaCore = require('./schemas/jsonSchemaCore');

/* The schema schema cannot validate/adapt itself after having been instantiated from raw JSON.
 * At first we apply all adaptations manually, including:
 * - instantiating (sub)schemas
 * - resolve references
 * - set fallbacks (strict)
 * - eventually make extends change the parent schema
 */

(jsonSchemaCore = new Schema(jsonSchemaCore))
	.setFallbacks(Validation.STRICT_FALLBACKS)

for (var key in jsonSchemaCore.properties) {

	(jsonSchemaCore.properties[key] = new Schema(jsonSchemaCore.properties[key]))
		.setFallbacks(Validation.STRICT_FALLBACKS)
}

(jsonSchemaCore.properties.type.items = new Schema(jsonSchemaCore.properties.type.items))
	.setFallbacks(Validation.STRICT_FALLBACKS)
	
jsonSchemaCore.properties.type.items.enum = jsonSchemaCore.properties.type.enum

jsonSchemaCore.properties.id.pattern = new RegExp(jsonSchemaCore.properties.id.pattern);

(jsonSchemaCore.properties.options.items = new Schema(jsonSchemaCore.properties.options.items))
	.setFallbacks(Validation.STRICT_FALLBACKS)

jsonSchemaCore.properties.requires.additionalProperties = jsonSchemaCore;

(jsonSchemaCore.properties.pre.items = new Schema(jsonSchemaCore.properties.pre.items))
	.setFallbacks(Validation.STRICT_FALLBACKS);

///
(jsonSchemaCore.properties.post.items = new Schema(jsonSchemaCore.properties.post.items))
	.setFallbacks(Validation.STRICT_FALLBACKS);

(jsonSchemaCore.properties.fallbacks.additionalProperties = new Schema(jsonSchemaCore.properties.fallbacks.additionalProperties))
	.setFallbacks(Validation.STRICT_FALLBACKS)

jsonSchemaCore.properties.properties.additionalProperties = jsonSchemaCore

//Luhmannesk moment
//jsonSchemaCore.properties.extends.extends = jsonSchemaCore

jsonSchemaCore.properties.items.properties = jsonSchemaCore.properties

jsonSchemaCore.properties.items.items = jsonSchemaCore

jsonSchemaCore.properties.additionalProperties.properties = jsonSchemaCore.properties

/* Now, the core schema should be as if it had validated itself.
 * Check it out:
 */

var validation = jsonSchemaCore.validate(jsonSchemaCore)

if (validation.isError()) {

	_.log('The core schema is not valid!')
	validation.errors.forEach(function (error) {
	
		_.log(error)
	})
	_.log(validation)
}




module.exports = Schema
