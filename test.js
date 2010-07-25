// schema.js - test - Copyright Andreas Kalsch <andreaskalsch@gmx.de> (MIT Licensed)




var sys = require('sys'),
	assert = require('assert'),
		a = assert.strictEqual,
		d = assert.deepEqual,
	Schema = require('schema');




var v;

// To test checkers only, use strict fallbacks
Schema.prototype.setFallbacks(Schema.STRICT_FALLBACKS);

function S (schema) {

	return Schema.create(schema);
};

function V (schema, instance) {

	return Schema.create(schema).validate(instance);
};




// Schema.Validation.Error

a(
	new Schema.Validation.Error instanceof Schema.Validation.Error,
	true
);

a(
	new Schema.Validation.Error instanceof Error,
	true
);

a(
	(new Schema.Validation.Error).message,
	''
);




// Schema.Validation


	// optional

v = V({type:'any'}, undefined);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'optional'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

a(
	v.instance,
	undefined
);

v = V({type:'any'}, 1);

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

a(
	v.instance,
	1
);

v = V({type:'any',optional:true}, undefined);

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

a(
	v.instance,
	undefined
);


	// adapters
	
Schema.plugins.strToArray = function (instance) {

	if (typeof instance !== 'string') {
	
		this.pushError('strToArray');
		return instance;
	}
	
	return instance.split(',');
};

v = V({
	type:'array',
	adapters: 'strToArray'
}, 'a,b');

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
	['a', 'b']
);

v = V({
	type:'string',
	adapters: [
		'strToArray',
		function (instance) {

			if (!(instance instanceof Array)) {
			
				this.pushError('filter');
				return instance;
			}
			
			return instance.join('.');
		}
	]
}, 'a,b');

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
	'a.b'
);

v = V({
	type:'string',
	adapters: [
		'strToArray',
		'strToArray'
	]
}, 'a,b');

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'strToArray'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	['a', 'b']
);


	// type
	
	
		// null
		
v = V({
	type:'null'
}, null);

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
	null
);

v = V({
	type:'null'
}, 1);

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
	1
);



		// array

v = V({
	type:'array'
}, []);

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

v = V({
	type:'array'
}, '');

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

v = V({
	type:'array',
	minItems: 2
}, [1,2]);

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
	[1,2]
);

v = V({
	type:'array',
	minItems: 3
}, [1,2]);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'minItems'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	[1,2]
);

v = V({
	type:'array',
	maxItems: 2
}, [1,2]);

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
	[1,2]
);

v = V({
	type:'array',
	maxItems: 1,
	fallbacks: {maxItems:'pushError'}
}, [1,2]);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'maxItems'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	[1,2]
);

v = V({
	type:'array',
	items: S({
		type:'integer'
	})
}, [1,2]);

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
	[1,2]
);

v = V({
	type:'array',
	items: S({
		type:'string'
	})
}, [1,2]);

a(
	v.errors.length,
	2
);

a(
	v.errors.length ? v.errors[0].name : '',
	'type'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[0]
);

d(
	v.instance,
	[1,2]
);

v = V({
	type:'array',
	items: S({
		type:'integer'
	}),
	additionalProperties:false
}, [1,2]);

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
	[1,2]
);

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
}, ['',false,9]);

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
	['',false,9]
);

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
}, [9,false,9]);

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
	[0]
);

d(
	v.instance,
	[9,false,9]
);

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
}, ['',false]);

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
	['',false]
);

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
}, ['',false,1]);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'additionalProperties'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	['',false,1]
);

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
}, ['',false,1]);

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
	['',false,1]
);

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
}, ['',false,1]);

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
	['',false,1]
);

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
}, ['',false,'1']);

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
	[2]
);

d(
	v.instance,
	['',false,'1']
);




		// object

v = V({
	type:'object'
}, {});

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

v = V({
	type:'object'
}, '');

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

a(
	v.instance,
	''
);

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	}
}, {a:1});

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
	{a:1}
);

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	}
}, {a:false});

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
	['a']
);

d(
	v.instance,
	{a:false}
);

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	}
}, {});

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'optional'
);

d(
	v.errors.length ? v.errors[0].path : '',
	['a']
);

d(
	v.instance,
	{}
);

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	},
	additionalProperties: false
}, {a:1});

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
	{a:1}
);

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	},
	additionalProperties: false
}, {a:1,b:1});

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'additionalProperties'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	{a:1,b:1}
);

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer'
		})
	},
	additionalProperties: true
}, {a:1,b:1});

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
	{a:1,b:1}
);


		// number
		
v = V({
	type:'number'
}, '5');

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
	'5'
);

v = V({
	type:'number'
}, 5);

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

v = V({
	type:'number',
	minimum: 10
}, 5);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'minimum'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	5
);

v = V({
	type:'number',
	minimum: 10
}, 10);

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
	10
);

v = V({
	type:'number',
	maximum: 2
}, 5);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'maximum'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	5
);

v = V({
	type:'number',
	maximum: 12
}, 10);

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
	10
);

v = V({
	type:'number',
	maxDecimal:2
}, 10.12);

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
	10.12
);

v = V({
	type:'number',
	maxDecimal:1
}, 10.12);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'maxDecimal'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	10.12
);

v = V({
	type:'integer'
}, 1.2);

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
	1.2
);

v = V({
	type:'integer'
}, 1.0);

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
	1
);

v = V({
	type:'integer',
	maxDecimal:-1
}, 10);

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
	10
);

v = V({
	type:'integer',
	maxDecimal:-1
}, 11);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'maxDecimal'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	11
);


		// string
		
v = V({
	type:'string'
}, 11);

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
	11
);

v = V({
	type:'string',
	pattern:/[a-z]/
}, '_ _');

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'pattern'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	'_ _'
);

v = V({
	type:'string',
	pattern:/[a-z]/
}, 'mdg');

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
	'mdg'
);

v = V({
	type:'string',
	minLength: 1
}, '');

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'minLength'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	''
);

v = V({
	type:'string',
	minLength: 2
}, 'aa');

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
	'aa'
);

v = V({
	type:'string',
	maxLength: 2
}, 'aaa');

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'maxLength'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

d(
	v.instance,
	'aaa'
);

v = V({
	type:'string',
	maxLength: 2
}, 'aa');

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
	'aa'
);



		// boolean

v = V({
	type:'boolean'
}, false);

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

a(
	v.instance,
	false
);

v = V({
	type:'boolean'
}, 'false');

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

a(
	v.instance,
	'false'
);



	// enum
	
v = V({
	type:'string',
	enum: ['a', 'b', 'c']
}, 'd');

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'enum'
);

d(
	v.errors.length ? v.errors[0].path : '',
	[]
);

a(
	v.instance,
	'd'
);

v = V({
	type:'string',
	enum: ['a', 'b', 'c']
}, 'a');

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

a(
	v.instance,
	'a'
);

v = V({
	type:'string',
	requires: 'a'
}, 'a');

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

a(
	v.instance,
	'a'
);

v = V({
	type:'object',
	properties: {
	
		a: S({
		
			type: 'integer',
			requires: 'b',
			optional: true
		})
	}
}, {});

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

v = V({
	type:'object',
	properties: {
	
		a: {
		
			type: 'integer',
			requires: {
				
				b: S({
				
					type: 'any'
				})
			},
			optional: true
		}
	}
}, {a:1});

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'optional'
);

d(
	v.errors.length ? v.errors[0].path : '',
	['b']
);

d(
	v.instance,
	{a:1}
);

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
}, {a:1,b:1});

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
	{a:1,b:1}
);

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
	adapters: function (instance) {
	
		instance.done = true;
		return instance;
	}
});
s.properties.related.items = s;

var i = {
	word: 'green',
	related: [
	
		{
			word: 'red'
		}
	]
};
i.related[0].related = i;

v = V(s, i);

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
};
i.related[0].related = i;

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
};
i.related[0].related = i;

v = V(s, i);

a(
	v.errors.length,
	1
);

a(
	v.errors.length ? v.errors[0].name : '',
	'minLength'
);

d(
	v.errors.length ? v.errors[0].path : '',
	['related', 0, 'word']
);




// Validating a schema

	
	// resolve refs - relative

v = Schema.instances.jsonSchemaCore.validate({
	type: 'object',
	properties: {
	
		a: {$ref:'#'}
	}
});

Schema.resolveRefs();

a(
	v.instance instanceof Schema,
	true
);

a(
	v.instance.properties.a instanceof Schema,
	true
);


	// resolve refs - by ID

v = Schema.instances.jsonSchemaCore.validate({
	id: 'xyz',
	type: 'object',
	properties: {
	
		a: {$ref:'xyz'}
	}
});

Schema.resolveRefs();

a(
	v.instance instanceof Schema,
	true
);

a(
	v.instance.properties.a instanceof Schema,
	true
);


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
});

Schema.resolveRefs();

a(
	v.instance instanceof Schema,
	true
);

a(
	v.instance.extends instanceof Schema,
	true
);

a(
	v.instance.properties.b instanceof Schema,
	true
);




// Real world example: Article with comments

v = Schema.create({
	id: 'article',
	type: 'object',
	properties: {
	
		a: {$ref:'xyz'}
	}
});

Schema.resolveRefs();

a(
	v instanceof Schema,
	true
);

a(
	v.properties.a instanceof Schema,
	true
);




// Complex example

Schema.prototype.setFallbacks(Schema.TOLERANT_FALLBACKS);

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
			adapters: function (value) {
			
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
});

validation = schema.validate({

	q: 'OK',
	start: -5,
	num: -100.99
});

assert.deepEqual(
	validation.instance,
	{
		q: 'OK',
		start: 0,
		num: 1,
		order: 'date',
		hl: 'en'
	}
);

assert.strictEqual(
	validation.isError(),
	false
);


// Test, if a several schemas will be used for the same object, but an endless recursion is prohibited

var schema = Schema.create({
	
	type: 'object',
	properties: {
		
		a: {
			optional: true,
			extends: {$ref:'#'},
			requires: 'b'
		}
	}
});

Schema.resolveRefs();

var obj = {a:{}};
var validation = schema.validate(obj);

//sys.puts(sys.inspect(validation.errors[0]))