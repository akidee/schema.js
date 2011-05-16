var assert = require('assert'),
	a = assert.strictEqual,
	d = assert.deepEqual,
	env = require('../../')({
		i18n: [],
		fallbacks: 'STRICT_FALLBACKS'
	}),
	Schema = env.Schema,
	S = function (schema) {

		return Schema.create(schema)
	},
	V = function (schema, instance) {

		return S(schema).validate(instance)
	},
	v




// new Validation()


	// optional
v = V({type:'any'}, undefined)

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	
env.Validation.plugins.strToArray = function (instance) {

	if (typeof instance !== 'string') {
	
		new this.Error('strToArray')
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
	v.errors.length ? v.errors[0].attribute : '',
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
			
				new this.Error('filter')
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	fallbacks: {maxItems:'addError'}
}, [1,2])

a(
	v.errors.length,
	1
)

a(
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
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
	v.errors.length ? v.errors[0].attribute : '',
	'type'
)




// Validation.plugins (tolerant fallbacks)

env = require('schema')({
		i18n: [],
		fallbacks: 'TOLERANT_FALLBACKS'
	}),
	Schema = env.Schema

// castTolerantlyToType


	// string

v = V(
	{
		type: 'string',
		fallbacks: {type: 'castTolerantlyToType'}
	},
	5
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	'5'
);

v = V(
	S({
		type: 'string',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	{}
);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	{}
);

v = V(
	S({
		type: 'string',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	null
);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	null
);

v = V(
	S({
		type: 'string',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	{toString:6}
);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	{toString:6}
);

v = V(
	S({
		type: 'string',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	{toString:function () {return 'OK';}}
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	'OK'
);


	// number
	
v = V(
	S({
		type: 'number',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	false
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	0
);

v = V(
	S({
		type: 'number',
		fallbacks: {type: 'castTolerantlyToType'}
	})
	,
	'5.5'
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	5.5
);

v = V(
	S({
		type: 'number',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	'___'
);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	'___'
);


	// integer
	
v = V(
	S({
		type: 'integer',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	false
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	0
);

v = V(
	S({
		type: 'integer',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	'5.5'
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	5
);

v = V(
	S({
		type: 'integer',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	'___'
);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	'___'
);


	// boolean
	
v = V(
	S({
		type: 'boolean',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	' False '
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	false
);

v = V(
	S({
		type: 'boolean',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	'0.000'
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	false
);

v = V(
	S({
		type: 'boolean',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	'___'
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	true
);

v = V(
	S({
		type: 'boolean',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	[]
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	true
);


	// object
	
v = V(
	S({
		type: 'object',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	[]
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	{}
);

v = V(
	S({
		type: 'object',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	''
);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	''
);

v = V(
	S({
		type: 'object',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	null
);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	null
);


	// array
	
v = V(
	S({
		type: 'array',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	null
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	[]
);

v = V(
	S({
		type: 'array',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	{}
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	[]
);

v = V(
	S({
		type: 'array',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	'_'
);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	'_'
);


// roundToMaxDecimal

v = V(
	S({
		type: 'integer',
		fallbacks: {maxDecimal: 'roundToMaxDecimal'}
	}),
	5
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	5
);

v = V(
	S({
		type: 'integer',
		maxDecimal: -1,
		fallbacks: {maxDecimal: 'roundToMaxDecimal'}
	}),
	55
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	50
);

v = V(
	S({
		type: 'number',
		maxDecimal: 4,
		fallbacks: {maxDecimal: 'roundToMaxDecimal'}
	}),
	1.23456
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	1.2345
);


// setMinimum
	
v = V(
	S({
		type: 'number',
		minimum: 4,
		fallbacks: {minimum: 'setMinimum'}
	}),
	3
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	4
);


// setMaximum
	
v = V(
	{
		type: 'number',
		maximum: 5,
		fallbacks: {
			maximum: 'setMaximum'
		}
	},
	6
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	5
);


// truncateToMaxLength
	
v = V(
	S({
		type: 'string',
		maxLength: 2,
		fallbacks: {
			maxLength: 'truncateToMaxLength'
		}
	}),
	'ABC'
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	'AB'
);


// setDefault
	
v = V(
	S({
		type: 'string',
		maxLength: 2,
		'default': 'AA',
		fallbacks: {
			maxLength: 'setDefault'
		}
	}),
	'ABC'
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	'AA'
);


// removeAdditionalProperties
	
v = V(
	S({
		type: 'object',
		additionalProperties: false,
		fallbacks: {
			additionalProperties: 'removeAdditionalProperties'
		}
	}),
	{a:1}
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	{}
);
	
v = V(
	S({
		type: 'array',
		items: [S({type:'any'})],
		additionalProperties: false,
		fallbacks: {
			additionalProperties: 'removeAdditionalProperties'
		}
	}),
	[1,2,3]
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	[1]
);


// sliceToMaxItems

v = V(
	S({
		type: 'array',
		maxItems: 1,
		fallbacks: {
			maxItems: 'sliceToMaxItems'
		}
	}),
	[1,2,3]
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	[1]
);


// deleteInstance

v = V(
	S({
		type: 'number',
		fallbacks: {
			type: 'deleteInstance'
		}
	}),
	''
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	undefined
);


v = V(
	S({
		type: 'number',
		fallbacks: {
			type: 'deleteInstance'
		}
	}),
	5
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].attribute : '',
	''
);

d(
	v.errors.length ? v.errors[0].path : '',
	''
);

d(
	v.instance,
	5
);




console.log('Passed');
