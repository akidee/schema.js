/* schema.js
 * 
 * Sophisticated JSON schema data validation and adaptation
 * Copyright 2010-2011 Andreas Kalsch
 */




// Create environments to instantiate schemas and validations




var objecttools = require('./objecttools'),
	utils = require('./utils'),
	slice = Array.prototype.slice,
	extend = utils.extend,
	locale = utils.locale
	



var Environment = function (id, options) {

	var env

	if (typeof id === 'object')
		options = id
	else {
		if (Environment.instances[id])
			return Environment.instances[id]


		env = this
		this.id = id
		Environment.instances[id] = this
	}



	// Options

	options = options || {}
	

	// option: i18n
	
	var _i18n = options.i18n || [ '../i18n/default' ]
	if (!(_i18n instanceof Array))
		_i18n = [ _i18n ]

	var i18n = this.i18n = function (id) {
		return i18n[id] || { en: function () { return '' } }
	},
		part
	for (var i = 0, ii = _i18n.length; i < ii; i++) {

		part = _i18n[i]
		if (typeof part === 'object')
			extend(i18n, part)
		else
			extend(i18n, require(part))
	}

	delete options.i18n


	// option: locale

	this.locale = options.locale || 'en'

	delete options.locale


	// option: v

	if ([ 'draft-02' ].indexOf(options.v) === -1)
		this.v = 'draft-02'

	delete options.v


	// option: detectRecursion

	this.detectRecursion = options.detectRecursion === undefined
		? true
		: options.detectRecursion

	delete options.detectRecursion


	require('./schema').call(this)
	var Schema = this.Schema


	Schema.v = this.v


	require('./validation').call(this)
	var Validation = this.Validation


	// option: fallbacks
	
	var fallbacks = options.fallbacks || 'TOLERANT_FALLBACKS'
	if (typeof fallbacks === 'object')
		this.fallbacks = extend(Validation.STRICT_FALLBACKS, fallbacks)
	else
		this.fallbacks = Validation[fallbacks]

	delete options.fallbacks


	// All standard options parsed, but this is extended with non-standard options, too

	extend(this, options)


	/* Setup the schema schema
	 *
	 * The schema schema cannot validate/adapt itself after having been instantiated from raw JSON.
	 * At first we apply all adaptations manually, including:
	 * - instantiating (sub)schemas
	 * - resolve references
	 * - set fallbacks (strict)
	 * - eventually make extends change the parent schema
	 */

	require('./'+this.v+'/setupSchemaSchema').call(this)


	// Now, the schema schema should be as if it had validated itself:

	var validation = this.schemaSchema.validate(this.schemaSchema, { detectRecursion: true })

	if (validation.isError()) {

		console.log('The core schema is not valid!')
		throw validation.getError()
		/*validation.errors.forEach(function (error) {
	
			console.log(error)
		})
		console.log(validation)*/
	}
}


extend(Environment.prototype, {

	validateCall: function (func, context) {

		if (!(func.SCHEMA instanceof this.Schema))
			throw 'No SCHEMA defined';
	

		var v = func.SCHEMA.validate(slice.call(arguments, 2)),
			args = v.instance
		if (v.isError())
			throw v.getError();
	
	
		return func.apply(context, args);
	},

	validateCallAsync: function (func, context) {

		if (!(func.SCHEMA instanceof this.Schema))
			throw 'No SCHEMA defined'
	

		var args = slice.call(arguments, 2),
			_cb = args.pop(),
			v = func.SCHEMA.validate(args),
			args = v.instance
		if (v.isError())
			return _cb(v.getError())
	
	
		args.push(_cb)
		func.apply(context, args)
	},

	f: function (schema/* ? */, isValidating/* ? */, isAsync/* ? */, func) {

		var args = slice.call(arguments),
			func = args.pop()

		if (args.length === 0) {

			func.IS_ASYNC = false
			return func
		}

		if (schema instanceof Object) {

			var isValidating = !!args[1],
				schema = this.Schema.create(schema),
				isAsync = !!args[2],
				func_,
				func__

			var _this = this
			if (!isAsync)
				func_ = function () {

					return _this.validateCall.apply(_this, [func, this].concat(slice.call(arguments)))
				}
			else
				func_ = function () {

					return _this.validateCallAsync.apply(_this, [func, this].concat(slice.call(arguments)))
				}

			func.SCHEMA = schema
			func.IS_VALIDATING = isValidating
			func.IS_ASYNC = isAsync

			func_.SCHEMA = schema
			func_.IS_VALIDATING = isValidating
			func_.IS_ASYNC = isAsync

			func__ = isValidating
				? func_
				: func			

			if (!isValidating) 
				func__.validate = func_

			return func__
		}


		func.IS_ASYNC = !!args[0]
		return func
	}
})


Environment.instances = {}


var createEnvironment = function (id, options) {

	return new Environment(id, options)
}




if (typeof module === 'object' && module.exports)
	module.exports = createEnvironment
else
	window.createEnvironment = createEnvironment
