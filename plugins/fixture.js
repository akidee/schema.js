var sys = require('sys');
require('extensions');


module.exports = {


	// fallbacks

	fixture: function (errorName) {

		return function (instance) {

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

					this.pushError(errorName);
					return instance;
				}
				return ''+instance;
			}

			if (toType === 'number') {

				if (fromType !== 'boolean') {

					inst = parseFloat(instance);
					if (isNaN(inst)) {

						this.pushError(errorName);
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

						this.pushError(errorName);
						return instance;
					}

					return inst;
				}
				if (instance === false) return 0;
				if (instance === true) return 1;
			}

			if (toType === 'boolean') {

				if (fromType === 'string') {

					// simple and clear
					return !!instance;

					if (instance.trim().toLowerCase() === 'false') return false;

					inst = parseFloat(instance);
					return isNaN(inst) ? true : !!inst;
				}

				if (fromType === 'object') {

					this.pushError(errorName);
					return instance;
				}

				return !!instance;
			}

			if (toType === 'object') {

				if (instance instanceof Array && instance.length === 0) return {};
				if (fromType !== 'object' || instance === null) this.pushError(errorName);
				return instance;
			}

			if (toType === 'array') {

				if (!instance) return [];
				if (instance instanceof Object) {

					if (Object.keys(instance).length === 0) return [];
				}
				this.pushError(errorName);
				return instance;
			}

			if (toType === 'null') {

				this.pushError(errorName);
				return instance;
			}

			if (toType === 'date') {

				var date = new Date(instance);
				if (isNaN(date.getTime())) {
					this.pushError(errorName);
				} else {
					instance = date;
				}
				return instance;
			}
		};
	}

};
