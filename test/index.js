// schema.js - test - Copyright Andreas Kalsch <andreaskalsch@gmx.de> (MIT Licensed)




var assert = require('assert'),
	a = assert.strictEqual,
	d = assert.deepEqual,
	Schema = require('schema')




// example 1) from README.markdown

// mySchema instanceof Schema === true
var mySchema = Schema.create({type:'integer'})

// validation instanceof Schema.Validation === true
var validation = mySchema.validate(5)


// example 2) from README.markdown:
var result, errors, schema = Schema.create({

    type: 'object',
    properties: {

        q: {

            type: 'string',
            minLength: 1,
            maxLength: 200,
            'default':'',
            fallbacks: {maxLength:'truncateToMaxLength'}
        },

        hl: {

            type: 'string',
            enum: ['en', 'de', 'fr'],
            'default': 'en',
            pre: function (value) {

                if (typeof value === 'object') return value
                return String(value).toLowerCase()
            }
        },

        start: {

            type: 'integer',
            minimum: 0,
            maximum: 991,
            maximumCanEqual: false,
            'default': 0
        },

        num: {

            type: 'integer',
            minimum: 1,
            maximum: 100,
            fitMinMax: true,
            'default': 10
        },

        order: {

            type: 'string',
            enum: ['name', 'date'],
            'default': 'date'
        }
    },

    additionalProperties: false
})

validation = schema.validate({

    q: 'OK',
    start: -5,
    num: -100.99
})

assert.deepEqual(
    validation.instance,
    {
        q: 'OK',
        start: 0,
        num: 1,
        order: 'date',
        hl: 'en'
    }
)

assert.strictEqual(
    validation.isError(),
    false
)



var v

function S (schema) {

	var s = Schema.create(schema)
	
	// To test checkers only, use strict fallbacks
	return s.setFallbacks(Schema.Validation.STRICT_FALLBACKS)
}

function V (schema, instance) {

	return S(schema).validate(instance)
}




// Schema.Validation.Error

a(
	new Schema.Validation.Error instanceof Schema.Validation.Error,
	true
)

a(
	new Schema.Validation.Error instanceof Error,
	true
)

a(
	(new Schema.Validation.Error).message,
	''
)




// Schema.Validation


	// optional

v = V({type:'any'}, undefined)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'optional'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

a(
	v.instance,
	undefined
)

v = V({type:'any'}, 1)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

a(
	v.instance,
	1
)

v = V({type:'any',optional:true}, undefined)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

a(
	v.instance,
	undefined
)


	// pre
	
Schema.Validation.plugins.strToArray = function (instance) {

	if (typeof instance !== 'string') {
	
		this.pushError('strToArray')
		return instance
	}
	
	return instance.split(',')
}

v = V({
	type:'array',
	pre: 'strToArray'
}, 'a,b')

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	['a', 'b']
)

v = V({
	type:'string',
	pre: [
		'strToArray',
		function (instance) {

			if (!(instance instanceof Array)) {
			
				this.pushError('filter')
				return instance
			}
			
			return instance.join('.')
		}
	]
}, 'a,b')

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	'a.b'
)

v = V({
	type:'string',
	pre: [
		'strToArray',
		'strToArray'
	]
}, 'a,b')

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'strToArray'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	['a', 'b']
)


	// type
	
	
		// null
		
v = V({
	type:'null'
}, null)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	null
)

v = V({
	type:'null'
}, 1)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	1
)



		// array

v = V({
	type:'array'
}, [])

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	[]
)

v = V({
	type:'array'
}, '')

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	''
)

v = V({
	type:'array',
	minItems: 2
}, [1,2])

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	[1,2]
)

v = V({
	type:'array',
	minItems: 3
}, [1,2])

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'minItems'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	[1,2]
)

v = V({
	type:'array',
	maxItems: 2
}, [1,2])

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	[1,2]
)

v = V({
	type:'array',
	maxItems: 1,
	fallbacks: {maxItems:'pushError'}
}, [1,2])

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'maxItems'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	[1,2]
)

v = V({
	type:'array',
	items: S({
		type:'integer'
	})
}, [1,2])

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	[1,2]
)

v = V({
	type:'array',
	items: S({
		type:'string'
	})
}, [1,2])

a(
	v.errors.length,
	2
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[0]
)

d(
	v.instance,
	[1,2]
)

v = V({
	type:'array',
	items: S({
		type:'integer'
	}),
	additionalProperties:false
}, [1,2])

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	[1,2]
)

v = V({
	type:'array',
	items: [
		S({
			type:'string'
		}),
		S({
			type:'boolean'
		})
	]
}, ['',false,9])

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	['',false,9]
)

v = V({
	type:'array',
	items: [
		S({
			type:'string'
		}),
		S({
			type:'boolean'
		})
	]
}, [9,false,9])

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[0]
)

d(
	v.instance,
	[9,false,9]
)

v = V({
	type:'array',
	items: [
		S({
			type:'string'
		}),
		S({
			type:'boolean'
		})
	],
	additionalProperties: false
}, ['',false])

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	['',false]
)

v = V({
	type:'array',
	items: [
		S({
			type:'string'
		}),
		S({
			type:'boolean'
		})
	],
	additionalProperties: false
}, ['',false,1])

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'additionalProperties'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	['',false,1]
)

v = V({
	type:'array',
	items: [
		S({
			type:'string'
		}),
		S({
			type:'boolean'
		})
	],
	additionalProperties: true
}, ['',false,1])

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	['',false,1]
)

v = V({
	type:'array',
	items: [
		S({
			type:'string'
		}),
		S({
			type:'boolean'
		})
	],
	additionalProperties: S({
		type: 'integer'
	})
}, ['',false,1])

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	['',false,1]
)

v = V({
	type:'array',
	items: [
		S({
			type:'string'
		}),
		S({
			type:'boolean'
		})
	],
	additionalProperties: S({
		type: 'integer'
	})
}, ['',false,'1'])

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[2]
)

d(
	v.instance,
	['',false,'1']
)




		// object

v = V({
	type:'object'
}, {})

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	[]
)

v = V({
	type:'object'
}, '')

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

a(
	v.instance,
	''
)

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	}
}, {a:1})

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	{a:1}
)

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	}
}, {a:false})

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	['a']
)

d(
	v.instance,
	{a:false}
)

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	}
}, {})

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'optional'
)

d(
	v.errors.length ? v.errors[0].path : '',
	['a']
)

d(
	v.instance,
	{}
)

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	},
	additionalProperties: false
}, {a:1})

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	{a:1}
)

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	},
	additionalProperties: false
}, {a:1,b:1})

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'additionalProperties'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	{a:1,b:1}
)

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	},
	additionalProperties: true
}, {a:1,b:1})

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	{a:1,b:1}
)


		// number
		
v = V({
	type:'number'
}, '5')

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	'5'
)

v = V({
	type:'number'
}, 5)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	5
)

v = V({
	type:'number',
	minimum: 10
}, 5)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'minimum'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	5
)

v = V({
	type:'number',
	minimum: 10
}, 10)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	10
)

v = V({
	type:'number',
	maximum: 2
}, 5)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'maximum'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	5
)

v = V({
	type:'number',
	maximum: 12
}, 10)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	10
)

v = V({
	type:'number',
	maxDecimal:2
}, 10.12)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	10.12
)


v = V({
	type:'number',
	maxDecimal:1
}, 10.12)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'maxDecimal'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	10.12
)

v = V({
	type:'integer'
}, 1.2)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	1.2
)

v = V({
	type:'integer'
}, 1.0)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	1
)

v = V({
	type:'integer',
	maxDecimal:-1
}, 10)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	10
)

v = V({
	type:'integer',
	maxDecimal:-1
}, 11)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'maxDecimal'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	11
)


		// string
		
v = V({
	type:'string'
}, 11)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	11
)

v = V({
	type:'string',
	pattern:/[a-z]/
}, '_ _')

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'pattern'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	'_ _'
)

v = V({
	type:'string',
	pattern:/[a-z]/
}, 'mdg')

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	'mdg'
)

v = V({
	type:'string',
	minLength: 1
}, '')

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'minLength'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	''
)

v = V({
	type:'string',
	minLength: 2
}, 'aa')

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	'aa'
)

v = V({
	type:'string',
	maxLength: 2
}, 'aaa')

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'maxLength'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

d(
	v.instance,
	'aaa'
)

v = V({
	type:'string',
	maxLength: 2
}, 'aa')

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	'aa'
)



		// boolean

v = V({
	type:'boolean'
}, false)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

a(
	v.instance,
	false
)

v = V({
	type:'boolean'
}, 'false')

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

a(
	v.instance,
	'false'
)



	// enum
	
v = V({
	type:'string',
	enum: ['a', 'b', 'c']
}, 'd')

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'enum'
)

d(
	v.errors.length ? v.errors[0].path : '',
	[]
)

a(
	v.instance,
	'd'
)

v = V({
	type:'string',
	enum: ['a', 'b', 'c']
}, 'a')

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

a(
	v.instance,
	'a'
)

v = V({
	type:'string',
	requires: 'a'
}, 'a')

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

a(
	v.instance,
	'a'
)

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer',
			requires: 'b',
			optional: true
		})
	}
}, {})

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	{}
)

v = V({
	type:'object',
	properties: {
	
		a: {
		
			type: 'integer',
			requires: {
				
				b: {
				
					type: 'any'
				}
			},
			optional: true
		}
	}
}, {a:1})

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'optional'
)

d(
	v.errors.length ? v.errors[0].path : '',
	['b']
)

d(
	v.instance,
	{a:1}
)

v = V({
	type:'object',
	properties: {
	
		a: {
		
			type: 'integer',
			requires: {
				
				b: {
				
					type: 'any'
				}
			},
			optional: true
		}
	}
}, {a:1,b:1})

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

d(
	v.instance,
	{a:1,b:1}
)

var s = S({

	type: 'object',
	properties: {
	
		word: {
		
			type: 'string',
			minLength: 1
		},
		related: {
		
			type: 'array'
		}
	},
	pre: function (instance) {
	
		instance.done = true
		return instance
	},
	optional: true
})
s.properties.related.items = s

var i = {
	word: 'green',
	related: [
	
		{
			word: 'red'
		}
	]
}
i.related[0].related = [i]

v = V(s, i)

a(
	v.errors.length,
	0
)

a(
	v.errors.length ? v.errors[0].name : '',
	''
)

d(
	v.errors.length ? v.errors[0].path : '',
	''
)

// Will break deepEqual - http://github.com/ry/node/issues/issue/207
// But if script finishes without this check, my validation has detected the recursion
/*i = {
	word: 'green',
	related: [
	
		{
			word: 'red',
			done: 1
		}
	],
	done: 1
}
i.related[0].related = i

/*d(
	v.instance,
	i
);*/

i = {
	word: 'green',
	related: [
	
		{
			word: ''
		}
	]
}
i.related[0].related = [i]

v = V(s, i)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].name : '',
	'minLength'
)

d(
	v.errors.length ? v.errors[0].path : '',
	['related', 0, 'word']
)


	// getError

a(
	v.getError() instanceof Error,
	true
)

d(
	v.getError().errors,
	v.errors
)




// Validating a schema

	
	// resolve refs - relative

v = Schema.instances.jsonSchemaCore.validate({
	type: 'object',
	properties: {
	
		a: {$ref:'#'}
	}
})

Schema.resolveRefs()

a(
	v.instance instanceof Schema,
	true
)

a(
	v.instance.properties.a instanceof Schema,
	true
)


	// resolve refs - by ID

v = Schema.instances.jsonSchemaCore.validate({
	id: 'xyz',
	type: 'object',
	properties: {
	
		a: {$ref:'xyz'}
	}
})

Schema.resolveRefs()

a(
	v.instance instanceof Schema,
	true
)

a(
	v.instance.properties.a instanceof Schema,
	true
)


	// extends

v = Schema.instances.jsonSchemaCore.validate({
	id: 'wxyz',
	type: 'object',
	properties: {
	
		b: {
			type: 'integer'
		}
	},
	extends:{$ref:'xyz'}
})

Schema.resolveRefs()

a(
	v.instance instanceof Schema,
	true
)

a(
	v.instance.extends instanceof Schema,
	true
)

a(
	v.instance.properties.b instanceof Schema,
	true
)




// Real world example: Article with comments

v = Schema.create({
	id: 'article',
	type: 'object',
	properties: {
	
		a: {$ref:'xyz'}
	}
})

Schema.resolveRefs()

a(
	v instanceof Schema,
	true
)

a(
	v.properties.a instanceof Schema,
	true
)




// Complex example

Schema.prototype.setFallbacks(Schema.TOLERANT_FALLBACKS)

var result, errors, schema = Schema.create({

	type: 'object',
	properties: {
	
		q: {
		
			type: 'string',
			minLength: 1,
			maxLength: 200,
			'default':'',
			fallbacks: {maxLength:'truncateToMaxLength'}
		},
		
		hl: {
		
			type: 'string',
			enum: ['en', 'de', 'fr'],
			'default': 'en',
			pre: function (value) {
			
				if (typeof value === 'object') return value
				return String(value).toLowerCase()
			}
		},
		
		start: {
		
			type: 'integer',
			minimum: 0,
			maximum: 991,
			maximumCanEqual: false,
			'default': 0
		},
		
		num: {
		
			type: 'integer',
			minimum: 1,
			maximum: 100,
			fitMinMax: true,
			'default': 10
		},
		
		order: {
		
			type: 'string',
			enum: ['name', 'date'],
			'default': 'date'
		}
	},
	
	additionalProperties: false
})

validation = schema.validate({

	q: 'OK',
	start: -5,
	num: -100.99
})

assert.deepEqual(
	validation.instance,
	{
		q: 'OK',
		start: 0,
		num: 1,
		order: 'date',
		hl: 'en'
	}
)

assert.strictEqual(
	validation.isError(),
	false
)


// Test, if several schemas will be used for the same object, but an endless recursion is prohibited

var schema = Schema.create({
	
	type: 'object',
	properties: {
		
		a: {
			type: 'object',
			optional: true,
			extends: {$ref:'#'},
			requires: 'b'
		}
	},
	optional: true
})

Schema.resolveRefs()

var obj = {a:{},b:0}
var v = schema.validate(obj)

a(
	v.errors.length,
	0
)

var obj = {a:1,b:0}
var v = schema.validate(obj)

a(
	v.errors.length,
	1
)

d(
	v.errors.length ? v.errors[0].path : [],
	['a']
)

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
)



// validateCall

function add (a, b) {

	return a + b
}

add.SCHEMA = Schema.create({

	type: 'array',
	items: {
		type: 'integer'
	},
	maxItems: 2
})


a(
	Schema.validateCall(add, null, 1, 5),
	6
)


try {
	Schema.validateCall(add, null, 'abc', 5)
}
catch (e) {

	a(e.errors.length, 1)
	a(e.errors[0].name, 'type')
}


a(
	Schema.validateCall(add, null, '1.02', 5),
	6
)



// validateCallAsync

function addAsync (a, b, _cb) {

	_cb(null, a + b)
}

addAsync.SCHEMA = Schema.create({

	type: 'array',
	items: {
		type: 'integer'
	},
	maxItems: 2
})

Schema.validateCallAsync(addAsync, null, '1.02', 5, 6, function (e, r1) {
	
	a(
		e instanceof Error,
		false
	)

	a(
		r1,
		6
	)
})



// f

	// schema = null, isValidating = false, isAsync = false, func

var f1 = function () {
	
},
	f2 = Schema.f(f1)

a(
	f1,
	f2
)

a(
	f2.SCHEMA,
	undefined
)

a(
	f2.IS_VALIDATING,
	undefined
)

a(
	f2.IS_ASYNC,
	false
)


	// schema = null, isValidating = false, isAsync = true, func

var f1 = function () {
	
},
	f2 = Schema.f(true, f1)

a(
	f1,
	f2
)

a(
	f2.SCHEMA,
	undefined
)

a(
	f2.IS_VALIDATING,
	undefined
)

a(
	f2.IS_ASYNC,
	true
)


	// schema, isValidating = false, isAsync = false, func

f1 = function (num) {

	return num
}

var obj = {
	a: 1,
	b: Schema.f(

		S({
			type: 'array',
			items: [
				S({
					type: 'integer',
					maximum: 1000
				})
			]
		}),

		f1

	)
}

a(
	f1 === obj.b,
	true
)

a(
	obj.b.SCHEMA instanceof Schema,
	true
)

a(
	obj.b.IS_VALIDATING,
	false
)

a(
	obj.b.IS_ASYNC,
	false
)

try {

	obj.b.validate(10000)
}
catch (e) {

	a(e instanceof Error, true)
}


	// schema, isValidating = true, isAsync = false, isfunc

var obj = {
	a: 1,
	b: Schema.f(

		S({
			type: 'array',
			items: [
				S({
					type: 'integer',
					maximum: 1000
				})
			]
		}),

		true,

		function (num) {

			return num
		}

	)
}

a(
	f1 === obj.b,
	false
)

a(
	obj.b.SCHEMA instanceof Schema,
	true
)

a(
	obj.b.IS_VALIDATING,
	true
)

a(
	obj.b.IS_ASYNC,
	false
)

r = undefined
try {

	r = obj.b(1001)
}
catch (e) {

	a(
		e instanceof Error,
		true
	)

	a(
		r,
		undefined
	)
}


	// schema, isValidating = true, isAsync = true, isfunc

var obj = {
	a: 1,
	b: Schema.f(

		S({
			type: 'array',
			items: [
				S({
					type: 'integer',
					maximum: 1000
				})
			]
		}),

		true,
		true,

		function (num, _cb) {

			_cb(num)
		}

	)
}

a(
	f1 === obj.b,
	false
)

a(
	obj.b.SCHEMA instanceof Schema,
	true
)

a(
	obj.b.IS_VALIDATING,
	true
)

a(
	obj.b.IS_ASYNC,
	true
)

obj.b(1001, function (e, r) {

	a(
		e instanceof Error,
		true
	)

	a(
		r,
		undefined
	)
})




console.log('Passed');
