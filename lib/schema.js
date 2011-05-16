// Represents a JSON schema




var utils = require('./utils'),
	objecttools = require('./objecttools')




module.exports = function () {

	var env = this

	var Schema = this.Schema = function (rawSchema) {
		
		if (typeof rawSchema === 'string')
			rawSchema = JSON.parse(rawSchema)

		if (rawSchema instanceof Schema)
			return rawSchema;
	
	
		utils.extend(this, rawSchema)
	
		if (this.id === undefined)
			this.id = ''+Schema._id++
		Schema.instances[this.id] = this
	}

	utils.extend(Schema.prototype, {

		validate: function (instance, options) {
	
			return new env.Validation(this, instance, options)
		},

		setFallbacks: function (_fallbacks) {
	
			if (typeof _fallbacks === 'string') {
		
				this.fallbacks = env.Validation[_fallbacks]
			}
			else if (_fallbacks === undefined) {
		
				this.fallbacks = env.fallbacks
			}
			else {
		
				this.fallbacks = utils.extend({}, env.fallbacks, _fallbacks)
			}
		
			return this
		}
	})

	utils.extend(Schema, {

		_id: 1,

		create: function (rawSchema) {

			if (typeof rawSchema === 'string') {
		
				var rawSchema = JSON.parse(rawSchema)
			}
	
			var validation = env.schemaSchema.validate(rawSchema)
			if (validation.isError())
				throw validation.getError()
		

			/*validation.toJSON = function () {

				return rawSchema
			}*/
			return validation.instance
		},
	
		createSeveral: function (schemaDict) {
	
			for (var key in schemaDict) {
		
				if (schemaDict[key].id === undefined) schemaDict[key].id = key
			
			
				schemaDict[key] = this.create(schemaDict[key])
			}
		
			return schemaDict
		},

		instances: {},
	
		resolveRefs: function () {
	
			for (var id in this.instances) {

				objecttools.resolveRefs(this.instances[id], true)
			}
		}
	})
}
