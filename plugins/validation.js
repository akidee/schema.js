var i18n = require('../i18n'),
	_ = require('underscorex');
require('underscorex/object')(_);


module.exports = {

	// fallbacks

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
				
				this.pushError(
					errorName,
					i18n['validation_error_'+errorName]
				);
				return instance;
			}
			return ''+instance;
		}
		
		if (toType === 'number') {
		
			if (fromType !== 'boolean') {
			
				inst = parseFloat(instance);
				if (isNaN(inst)) {
				
					this.pushError(
						errorName,
						i18n['validation_error_'+errorName]
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
				
					this.pushError(
						errorName,
						i18n['validation_error_'+errorName]
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
			
				this.pushError(
					errorName,
					i18n['validation_error_'+errorName]
				);
			}
			return instance;
		}
		
		if (toType === 'array') {
		
			if (!instance) return [];
			if (instance instanceof Object) {
			
				if (_.keys(instance).length === 0) return [];
			}
			this.pushError(
				errorName,
				i18n['validation_error_'+errorName]
			);
			return instance;
		}
		
		if (toType === 'null') {
		
			this.pushError(
				errorName,
				i18n['validation_error_'+errorName]
			);
			return instance;
		}
	},
	
	roundToMaxDecimal: function (instance, errorName) {

		if (this.schema.maxDecimal === undefined) {
		
			this.pushError(
				errorName,
				i18n['validation_error_'+errorName]
			);
			return instance;
		}

		var factor = Math.pow(10, this.schema.maxDecimal);
		return Math[instance < 0 ? 'ceil' : 'floor'](instance * factor) / factor;
	},
	
	setMinimum: function (instance, errorName) {

		if (this.schema.minimum === undefined) {
		
			this.pushError(
				errorName,
				i18n['validation_error_'+errorName]
			);
			return instance;
		}

		return this.schema.minimum;
	},
	
	setMaximum: function (instance, errorName) {

		if (this.schema.maximum === undefined) {
		
			this.pushError(
				errorName,
				i18n['validation_error_'+errorName]
			);
			return instance;
		}
	
		return this.schema.maximum;
	},
	
	truncateToMaxLength: function (instance, errorName) {
	
		if (this.schema.maxLength === undefined) {
		
			this.pushError(
				errorName,
				i18n['validation_error_'+errorName]
			);
			return instance;
		}
	
		return instance.substr(0, this.schema.maxLength);	
	},
	
	setDefault: function (instance, errorName) {
	
		if ('default' in this.schema) return this.schema['default'];
			
		
		this.pushError(
			errorName,
			i18n['validation_error_'+errorName]	
		);
	},
	
	removeAdditionalProperties: function (instance, errorName) {
	
		if (this.schema.type === 'object') {
	
			var props = this.schema.properties || {};
			for (var ks = _.keys(
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

			/// instance.length will not change
			/*for (var li = instance.length, i = this.schema.maxItems; i < li; i++) {
			
				delete instance[i];
			}*/
			
			if (instance.length > this.schema.maxItems) {
			
				instance.splice(this.schema.maxItems);
			}
		}
		else {
		
			this.pushError(
				errorName,
				i18n['validation_error_'+errorName]
			);
		}
		
		return instance;
	},
	
	pushError: function (instance, errorName) {

		this.pushError(
			errorName,
			i18n['validation_error_'+errorName]
		);
		return instance;
	},
	
	deleteInstance: function (instance) { 
			
		// Solution needed - undefined means that property still exists
		return undefined;
	}
};
