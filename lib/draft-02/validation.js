// Validator for this JSON schema draft




var utils = require('../utils'),
	objecttools = require('../objecttools')




module.exports = function () {

	var env = this,
		Schema = this.Schema

	utils.extend(this.Validation.prototype, {
	
		// root handler
	
		start: function (instance) {

			if (this.detectRecursion && instance instanceof Object) {

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
				
					if (toType === 'integer') return fromType === 'number' && Math.round(instance) === instance
				
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
					
						for (var ks = Object.keys(
							instance
						), li = ks.length, i = 0, key; key = ks[i], i < li; i++) {
		
							if (!(key in props)) {
						
								return this.callPlugin(this.schema.fallbacks.additionalProperties, instance, 'additionalProperties', { propertyName : key })
							}
						}
					}
					else if (this.schema.additionalProperties !== true) {
								
						for (var ks = Object.keys(
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

	utils.extend(this.Validation, {
	
		TOLERANT_FALLBACKS: {

			optional: 'setDefault',
			type: 'castTolerantlyToType',
			enum: 'setDefault',
			requires: 'addError',
			additionalProperties: 'removeAdditionalProperties',
			maxItems: 'sliceToMaxItems',
			minItems: 'addError',
			maximum: 'setMaximum',
			minimum: 'setMinimum',
			maxDecimal: 'roundToMaxDecimal',
			pattern: 'addError',
			minLength: 'addError',
			maxLength: 'addError'
		},
	
		STRICT_FALLBACKS: {
	
			optional: 'addError',
			type: 'addError',
			enum: 'addError',
			requires: 'addError',
			additionalProperties: 'addError',
			maxItems: 'addError',
			minItems: 'addError',
			maximum: 'addError',
			minimum: 'addError',
			maxDecimal: 'addError',
			pattern: 'addError',
			minLength: 'addError',
			maxLength: 'addError'
		}
	})

	this.Validation.registerPlugins({


		// for the schema schema
	
		addToRefs: function (instance) {

			if (instance instanceof Object
				&& !(instance instanceof Array)
				&& typeof instance.$ref === 'string') {

				var toPath = this.path,
					fromPath = instance.$ref.split('.')
			
				objecttools.addRef(
					this.instance,
					[].concat(toPath),
					fromPath[0] === '#'
						? [].concat(fromPath)
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
		
			if (
				instance.requires 
				&& instance.requires instanceof Object
				&& !(instance.requires instanceof Array)
			) {
		
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
		
			objecttools.resetRefs(instance)
		
			return instance
		},


		// tolerant fallbacks

		castTolerantlyToType: function (instance, errorName) { 

			var toType = this.schema.type,
				fromType = typeof instance,
				inst;
		
			if (toType === 'string') {
		
				if (fromType === 'object') {
	
					if (
						instance !== null
						&& typeof instance.toString === 'function'
						&& instance.toString !== Object.prototype.toString
						&& instance.toString !== Array.prototype.toString
					) return ''+instance;
				
					new this.Error(
						errorName,
						env.i18n['validation_error_'+errorName]
					);
					return instance;
				}
				return ''+instance;
			}
		
			if (toType === 'number') {
		
				if (fromType !== 'boolean') {
			
					inst = parseFloat(instance);
					if (isNaN(inst)) {
				
						new this.Error(
							errorName,
							env.i18n['validation_error_'+errorName]
						);
						return instance;
					}
				
					return inst;
				}
				if (instance === false) return 0;
				if (instance === true) return 1;
			}
		
			if (toType === 'integer') {
		
				if (fromType !== 'boolean') {
			
					inst = parseInt(instance, 10);
					if (isNaN(inst)) {
				
						new this.Error(
							errorName,
							env.i18n['validation_error_'+errorName]
						);
						return instance;
					}
				
					return inst;
				}
				if (instance === false) return 0;
				if (instance === true) return 1;
			}
		
			if (toType === 'boolean') {
		
				if (fromType === 'string') {
	
					if (instance.trim().toLowerCase() === 'false') return false;
				
					inst = parseFloat(instance);
					return isNaN(inst) ? true : !!inst;
				}
			
				return !!instance;
			}
		
			if (toType === 'object') {
		
				if (instance instanceof Array && instance.length === 0) return {};
				if (fromType !== 'object' || instance === null || instance instanceof Array) {
			
					new this.Error(
						errorName,
						env.i18n['validation_error_'+errorName]
					);
				}
				return instance;
			}
		
			if (toType === 'array') {
		
				if (!instance) return [];
				if (instance instanceof Object) {

					var inst = [],
						key_int,
						allInt = true
					if (Object.keys(instance).length === 0) return inst;
					for (var key in instance) {

						key_int = parseInt(key, 10)
						if (''+key_int === key)
							inst[key_int] = instance[key]
						else
							allInt = false
							break;

						
						if (allInt)
							return inst;
					}
				}

			
				new this.Error(
					errorName,
					env.i18n['validation_error_'+errorName]
				);
				return instance;
			}
		
			if (toType === 'null') {
		
				new this.Error(
					errorName,
					env.i18n['validation_error_'+errorName]
				);
				return instance;
			}
		},
	
		roundToMaxDecimal: function (instance, errorName) {

			if (this.schema.maxDecimal === undefined) {
		
				new this.Error(
					errorName,
					env.i18n['validation_error_'+errorName]
				);
				return instance;
			}

			var factor = Math.pow(10, this.schema.maxDecimal);
			return Math[instance < 0 ? 'ceil' : 'floor'](instance * factor) / factor;
		},
	
		setMinimum: function (instance, errorName) {

			if (this.schema.minimum === undefined) {
		
				new this.Error(
					errorName,
					env.i18n['validation_error_'+errorName]
				);
				return instance;
			}

			return this.schema.minimum;
		},
	
		setMaximum: function (instance, errorName) {

			if (this.schema.maximum === undefined) {
		
				new this.Error(
					errorName,
					env.i18n['validation_error_'+errorName]
				);
				return instance;
			}
	
			return this.schema.maximum;
		},
	
		truncateToMaxLength: function (instance, errorName) {
	
			if (this.schema.maxLength === undefined) {
		
				new this.Error(
					errorName,
					env.i18n['validation_error_'+errorName]
				);
				return instance;
			}
	
			return instance.substr(0, this.schema.maxLength);	
		},
	
		setDefault: function (instance, errorName) {
	
			if ('default' in this.schema) return this.schema['default'];
			
		
			new this.Error(
				errorName,
				env.i18n['validation_error_'+errorName]	
			);
		},
	
		removeAdditionalProperties: function (instance, errorName) {
	
			if (this.schema.type === 'object') {
	
				var props = this.schema.properties || {};
				for (var ks = Object.keys(
					instance
				), li = ks.length, i = 0, key; key = ks[i], i < li; i++) {
			
					if (props[key] === undefined) delete instance[key];
				}
			
				return instance;
			}
		
			if (this.schema.items && this.schema.items instanceof Array) {
	
				for (var li = instance.length, i = this.schema.items.length; i < li; i++) {
			
					delete instance[i];
				}
			}
		
			return instance;
		},
	
		sliceToMaxItems: function (instance, errorName) {
	
			if (this.schema.maxItems !== undefined) {
			
				if (instance.length > this.schema.maxItems) {
			
					instance.splice(this.schema.maxItems);
				}
			}
			else {
		
				new this.Error(
					errorName,
					env.i18n['validation_error_'+errorName]
				);
			}
		
			return instance;
		},
	
		deleteInstance: function (instance) { 
			
			// Solution needed - undefined means that property still exists
			return undefined;
		}
	})
}
