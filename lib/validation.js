// Represents a validation of data by applying a schema




var utils = require('./utils'),
	objecttools = require('./objecttools'),
	locale = utils.locale,
	slice = Array.prototype.slice




module.exports = function () {

	var env = this,
		detectRecursion = this.detectRecursion

	var Validation = this.Validation = function (schema, instance, options) {

		options = options || {}



		// For recursion detection
		this._flags = {}
	
		// Errors must be unique by id
		this._errors = {}
		
		this._wasError = 0
	
		// Schema stack
		this._stack = []

		// Current path in instance
		this.path = []



		// Just necessary for recursion detection
		this.id = Validation._id++

		// Current schema (last this._stack item)
		this.schema
		this.push(schema)

		// Current instance
		this.instance = instance

		// Relevant for this.toJSON()
		this.locale = env.locale || 'en'

		// Recursion detection?
		this.detectRecursion = options.detectRecursion || detectRecursion

		this.errors = []


		var validation = this

		var _Error = this.Error = function (attribute, description, moreInfo) {

			this.path = validation.path
				? [].concat(validation.path)
				: []
			this.attribute = attribute || ''
			this.description = typeof description === 'object'
				? locale(description, validation.locale)(validation)
				: (description || '')
			if (moreInfo)
				utils.extend(this, moreInfo)

			if (!validation._errors[this.id()]) {
			
				validation._errors[this.id()] = true
				validation.errors.push(this)
			}

			validation._wasError++
		}

		_Error.prototype.toJSON = function () {

			return {
				path: this.path,
				name: this.attribute,
				description: this.description
			}
		}

		_Error.prototype.id = function () {

			return [ this.path, undefined, this.attribute ]+''
		}

	
		this.instance = this.start(instance)

		// Ready - remove uninteresting information
		delete this._flags, this._errors, this._wasError, this._stack, this.path, this.id
	}

	utils.extend(Validation.prototype, {

		// when ready

		isError: function () {
	
			return this.errors.length > 0
		},

		getError: function () {

			if (this.errors.length === 0)
				return null
				

			var e = new Error(
				locale(env.i18n('validation_error'), this.locale)(this)
			)
			e.errors = this.errors
			e.toJSON = function () {
				return {
					message: this.message,
					errors: this.errors
				}
			}
			return e
		},


		// change state, usable from plugins
	
		wasError: function () {
	
			var was = this._wasError
			this._wasError = 0
			return was
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
	
			return objecttools.id(instance)+'_'+this.schema.id
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
				plugin = Validation.plugins[plugin] || Validation.plugins.addError
			return plugin.apply(this, args)
		}
	})

	utils.extend(Validation, {
	
		_id: 1, /// Max?
	
		registerPlugins: function (plugins) {

			utils.extend(Validation.plugins, plugins)
		},

		plugins: {

			addError: function (instance, errorName, moreInfo) {

				new this.Error(
					errorName,
					env.i18n['validation_error_'+errorName],
					moreInfo
				);
				return instance;
			}
		}
	})

	require('./'+this.v+'/validation').call(this)
}
