var assert = require('assert')
var myEnv = require('schema')(
	'myEnvironment', {
		locale: 'de'
	}
)

var mySchema = myEnv.Schema.create({
    type: 'object',
    properties: {

        q: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            'default': '',
            fallbacks: {
                maxLength: 'truncateToMaxLength'
            }
        },

        hl: {
            type: 'string',
            enum: [ 'en', 'de', 'fr' ],
            'default': 'en',
            pre: function (value) {
                if (typeof value === 'object') return value;
                return String(value).toLowerCase();
            }
        },

        start: {
            type: 'integer',
            minimum: 0,
            maximum: 991,
            maximumCanEqual: false,
            'default': 0
        },

        order: {
            type: 'string',
            enum: [ 'name', 'date' ],
            'default': 'date'
        }
    },

    additionalProperties: false
})

var validation = mySchema.validate({
    q: 'OK',
    start: -5,
    num: -100.99,
    xyz: 'additionalProperty'
})

assert.deepEqual(
    validation.instance,
    {
        q: 'OK',
        start: 0,
        order: 'date',
        hl: 'en'
    }
)

assert.strictEqual(
    validation.isError(),
    false
)

console.log('Successful validation:')
console.log(JSON.stringify(validation.getError()))
console.log()


validation = mySchema.validate({
	q: {},
	start: 'ABC',
	num: -100.99,
	xyz: 'additionalProperty'
})

assert.strictEqual(
	validation.isError(),
    true
)

console.log('Validation with errors:')
console.log(JSON.stringify(validation.getError()))
