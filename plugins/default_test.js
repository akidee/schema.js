var sys = require('sys'),
	assert = require('assert'),
		a = assert.strictEqual,
		d = assert.deepEqual,
	Schema = require('schema');
	
	
	
Schema.prototype.setFallbacks(Schema.STRICT_FALLBACKS);

function S (schema) {

	return Schema.create(schema);
};

function V (schema, instance) {

	return new Schema.Validation(
		S(schema),
		instance
	);
};



// castTolerantlyToType


	// string

v = V(
	S({
		type: 'string',
		fallbacks: {type: 'castTolerantlyToType'}
	}),
	5
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	[]
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	S({
		type: 'number',
		maximum: 5,
		fallbacks: {
			maximum: 'setMaximum'
		}
	}),
	6
);

a(
	v.errors.length,
	0
);

a(
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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
	v.errors.length ? v.errors[0].name : '',
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