var Schema = require('schema'),
	assert = require('assert'),
	sys = require('sys'),
	lib = require('lib');
	
var errors,
	result,
	a = assert.strictEqual,
	tests = [],
	errors = [];
	
	

// Schema.number()


result = Schema.number(undefined,undefined,errors=[]);
a(
	result, 
	undefined
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'optional'
);


result = Schema.number(-1.3454,undefined,errors=[]);
a(
	result,
	-1.3454
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.number(10000,undefined,errors=[]);
a(
	result,
	10000
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.number('-1.3454',undefined,errors=[]);
a(
	result,
	-1.3454
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);



result = Schema.number('10000',undefined,errors=[]);
a(
	result,
	10000
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.number('-ä1.3454',undefined,errors=[]);
a(
	result,
	'-ä1.3454'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.number('ä1_0000',undefined,errors=[]);
a(
	result,
	'ä1_0000'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.number(true,undefined,errors=[]);
a(
	result,
	1
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.number(false,undefined,errors=[]);
a(
	result,
	0
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.number('3.12345',{maxDecimal:4},errors=[]);
a(
	result,
	3.1234
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.number(-100.001,{maxDecimal:0},errors=[]);
a(
	result,
	-100
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.number('-100.001',{maxDecimal:0,minimum:-50},errors=[]);
a(
	result,
	-100
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'minimum'
);


result = Schema.number('-100.001',{maxDecimal:0,minimum:-500,maximum:-200},errors=[]);
a(
	result,
	-100
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'maximum'
);


result = Schema.number(5,{maxDecimal:0,minimum:-10.5,maximum:100},errors=[]);
a(
	result,
	5
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.number(5,{'enum':[1,2,3,5]},errors=[]);
a(
	result,
	5
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.number('10',{'enum':[10]},errors=[]);
a(
	result,
	10
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


var divBy5 = function (value, errors, path) {
	
	var v = Math.round(value / 5);
	if (v * 5 === value) return v;
	else {
	
		Schema.push(errors, new Schema.Error(path, 'not divisble by 5'));
		return value;
	}
};


result = Schema.number(13,{adapt:divBy5},errors=[]);
a(
	result,
	13
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'not divisble by 5'
);


result = Schema.number(10,{adapt:divBy5},errors=[]);
a(
	result,
	2
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);



// Schema.integer()


result = Schema.integer(undefined,undefined,errors=[]);
a(
	result, 
	undefined
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'optional'
);


result = Schema.integer(undefined,{optional:true},errors=[]);
a(
	result, 
	undefined
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.integer(-10.6,undefined,errors=[]);
a(
	result, 
	-10
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.integer(5.2,undefined,errors=[]);
a(
	result, 
	5
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.integer(10000.8,undefined,errors=[]);
a(
	result, 
	10000
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.integer(true,undefined,errors=[]);
a(
	result, 
	1
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.integer(false,undefined,errors=[]);
a(
	result, 
	0
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.integer('1.4',undefined,errors=[]);
a(
	result, 
	1
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.integer('aspdgihsafig',undefined,errors=[]);
a(
	result, 
	'aspdgihsafig'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.integer('08',undefined,errors=[]);
a(
	result, 
	8
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.integer({},undefined,errors=[]);
a(
	typeof result, 
	'object'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.integer([],undefined,errors=[]);
a(
	result.length, 
	0
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);



// Schema.boolean()

result = Schema.boolean(1.4545,undefined,errors=[]);
a(
	result, 
	true
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.boolean(0,undefined,errors=[]);
a(
	result, 
	false
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.boolean('false',undefined,errors=[]);
a(
	result, 
	false
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.boolean('fasfhdgjhdfglse',undefined,errors=[]);
a(
	result, 
	true
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.boolean('1.000',undefined,errors=[]);
a(
	result, 
	true
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.boolean('23452',undefined,errors=[]);
a(
	result, 
	true
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.boolean('0.000',undefined,errors=[]);
a(
	result, 
	false
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.boolean({},undefined,errors=[]);
a(
	typeof result, 
	'object'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.boolean([],undefined,errors=[]);
a(
	result instanceof Array,
	true
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);



// Schema.string()


result = Schema.string(undefined,undefined,errors=[]);
a(
	result,
	undefined
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'optional'
);


result = Schema.string(undefined,{optional:true},errors=[]);
a(
	result,
	undefined
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.string({},undefined,errors=[]);
a(
	typeof result,
	'object'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


var O = {toString: function () { return 'STRING'; }};
result = Schema.string(O,undefined,errors=[]);
a(
	result,
	'STRING'
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


O = {toString: 'STRING'};
result = Schema.string(O,undefined,errors=[]);
a(
	typeof result,
	'object'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.string('',{minLength:1},errors=[]);
a(
	result,
	''
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'minLength'
);


result = Schema.string('A',{minLength:1},errors=[]);
a(
	result,
	'A'
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.string('123456',{maxLength:5},errors=[]);
a(
	result,
	'123456'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'maxLength'
);


result = Schema.string('12345',{maxLength:5},errors=[]);
a(
	result,
	'12345'
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.string('ABCDEF12345',{pattern:/[A-Z]+/},errors=[]);
a(
	result,
	'ABCDEF12345'
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.string('ABCDEF12345',{pattern:/G+/},errors=[]);
a(
	result,
	'ABCDEF12345'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'pattern'
);


result = Schema.string('a',{enum:['a', 'b']},errors=[]);
a(
	result,
	'a'
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.string('c',{enum:['a', 'b']},errors=[]);
a(
	result,
	'c'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'enum'
);


result = Schema.string(10000,undefined,errors=[]);
a(
	result,
	'10000'
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.string(0.12345,undefined,errors=[]);
a(
	result,
	'0.12345'
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.string(true,undefined,errors=[]);
a(
	result,
	'true'
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.string([],undefined,errors=[]);
a(
	result instanceof Array,
	true
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);



// Schema.object()


result = Schema.object(undefined,undefined,errors=[]);
a(
	result,
	undefined
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'optional'
);


result = Schema.object(undefined,{optional:true},errors=[]);
a(
	result,
	undefined
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.object([],undefined,errors=[]);
a(
	result instanceof Array,
	false
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.object({},{properties:{
	a: {type:'integer'}
}},errors=[]);
a(
	result instanceof Object,
	true
);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	['a']
);
a(
	errors.length ? errors[0].name : '',
	'optional'
);


result = Schema.object({a:1},{properties:{
	a: {type:'integer',requires:'b'}
}},errors=[]);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	['b']
);
a(
	errors.length ? errors[0].name : '',
	'requires'
);


result = Schema.object({a:1}, {
	type:'object',
	properties: {
		a: {
			type:'integer',
			requires: {
				type:'object',
				properties: {
					b: {type:'string'}
				}
			}
		}
	}
}, errors=[]);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	['b']
);
a(
	errors.length ? errors[0].name : '',
	'optional'
);


result = Schema.object({a:1,b:new Date},{properties:{
	a: {type:'integer',requires:{type:'object',properties:{b:{type:'string'}}}}
}},errors=[]);
a(
	errors.length, 
	0
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	''
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.object({a:1}, {
	type:'object',
	additionalProperties: false
}, errors=[]);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	['a']
);
a(
	errors.length ? errors[0].name : '',
	'additionalProperties'
);


result = Schema.object({a:1}, {
	type:'object',
	properties: {
	
		a: {
		
			type: 'string'
		}
	},
	additionalProperties: false
}, errors=[]);
a(
	errors.length, 
	0
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	''
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.object({a:'___'},{type:'object',additionalProperties: {
	type:'integer'
}},errors=[]);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	['a']
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.object({a:'___'},{type:'object',additionalProperties: false},errors=[]);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	['a']
);
a(
	errors.length ? errors[0].name : '',
	'additionalProperties'
);



// Schema.array()


result = Schema.array(false,undefined,errors=[]);
a(
	result instanceof Array,
	true
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.array('',undefined,errors=[]);
a(
	result instanceof Array,
	true
);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.array({},undefined,errors=[]);
a(
	result instanceof Object,
	true
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.array('sdogjsdf',undefined,errors=[]);
a(
	result,
	'sdogjsdf'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.array('sdogjsdf',undefined,errors=[]);
a(
	result,
	'sdogjsdf'
);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.array([],{minItems:1},errors=[]);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'minItems'
);


result = Schema.array([],{minItems:0},errors=[]);
a(
	errors.length, 
	0
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.array([1, 2],{maxItems:1},errors=[]);
a(
	errors.length, 
	1
);
a(
	errors.length ? errors[0].name : '',
	'maxItems'
);

result = Schema.array([1, '___'], {items:{type:'integer'}}, errors=[]);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	[1]
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);


result = Schema.array([2,{a:5}], {
	items: [
		{type:'integer'},
		{
			type:'object',
			properties: {a:{type:'integer'}}
		}
	]
}, errors=[]);
a(
	errors.length, 
	0
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	''
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.array([2], {
	items: [
		{type:'integer'},
		{
			type:'object',
			properties:{a:{type:'integer'}}
		}
	]
}, errors=[]);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	[1]
);
a(
	errors.length ? errors[0].name : '',
	'optional'
);


result = Schema.array([2,{a:2},6], {
	items: [
		{type:'integer'}, 
		{
			type:'object',
			properties:{a:{type:'integer'}}
		}
	]
}, errors=[]);
a(
	errors.length, 
	0
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	''
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.array([2,{a:2},6], {
	items: [
		{type:'integer'},
		{
			type:'object',
			properties:{a:{type:'integer'}}
		}
	],
	additionalProperties:false
}, errors=[]);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	[2]
);
a(
	errors.length ? errors[0].name : '',
	'additionalProperties'
);


result = Schema.array([2,{a:2},6], {
	items: [
		{type:'integer'},
		{
			type:'object',
			properties:{a:{type:'integer'}}
		}
	],
	additionalProperties:{}
}, errors=[]);
a(
	errors.length, 
	0
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	''
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.array([2,{a:2},6], {
	items: [
		{type:'integer'},
		{
			type:'object',
			properties:{a:{type:'integer'}}
		}
	],
	additionalProperties:{type:'string'}
}, errors=[]);
a(
	errors.length, 
	0
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	''
);
a(
	errors.length ? errors[0].name : '',
	''
);


result = Schema.array([2,{a:2},6], {
	items: [
		{type:'integer'},
		{
			type:'object',
			properties:{a:{type:'integer'}}
		}
	],
	additionalProperties:{type:'object'}
}, errors=[]);
a(
	errors.length, 
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	[2]
);
a(
	errors.length ? errors[0].name : '',
	'cast'
);



// Schema.apply()


var schema = {

	type: 'object',
	properties: {
	
		q: {
		
			type: 'string',
			minLength: 1,
			maxLength: 200,
			optional: true
		},
		
		hl: {
		
			type: 'string',
			enum: ['en', 'de', 'fr'],
			'default': 'en',
			adapt: function (value, errors, path) {
			
				return value.toLowerCase();
			}
		},
		
		start: {
		
			type: 'integer',
			minimum: 0,
			maximum: 991,
			maximumCanEqual: false,
			fitMinMax: true,
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
};


result = Schema.apply({

	q: 'OK',
	start: -5,
	num: -100.99
}, schema, errors=[]);
assert.deepEqual(
	result,
	{
		q: 'OK',
		start: 0,
		num: 1,
		order: 'date',
		hl: 'en'
	}
);
a(
	errors.length,
	0
);


result = Schema.apply({}, schema, errors=[]);
a(
	result.q,
	undefined
);
a(
	errors.length,
	0
);


result = Schema.apply({
	hl: 'De'
}, schema, errors=[]);
a(
	result.hl,
	'de'
);
a(
	errors.length,
	0
);


result = Schema.apply({
	hl: '__'
}, schema, errors=[]);
a(
	result.hl,
	'__'
);
a(
	errors.length,
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	['hl']
);
a(
	errors.length ? errors[0].name : '',
	'enum'
);


result = Schema.apply({
	start: 1000
}, schema, errors=[]);
a(
	result.start,
	1000
);
a(
	errors.length,
	1
);
assert.deepEqual(
	errors.length ? errors[0].path : '',
	['start']
);
a(
	errors.length ? errors[0].name : '',
	'maximum'
);


result = Schema.apply(null, {
	type:['object', 'null']
}, errors=[]);
a(
	result, 
	null
);
a(
	errors.length, 
	0
);


result = Schema.apply(1.567, {
	type:['number', 'integer']
}, errors=[]);
a(
	result, 
	1.567
);
a(
	errors.length, 
	0
);


result = Schema.apply('1.56', {
	type:['number', 'integer']
}, errors=[]);
a(
	result, 
	1.56
);
a(
	errors.length, 
	0
);


result = Schema.apply(1.567, {
	type:['number', 'boolean']
}, errors=[]);
a(
	result, 
	1.567
);
a(
	errors.length, 
	0
);


result = Schema.apply(true, {
	type:['number', 'boolean']
}, errors=[]);
a(
	result, 
	1
);
a(
	errors.length, 
	0
);


result = Schema.apply('false', {
	type:['number', 'boolean']
}, errors=[]);
a(
	result, 
	false
);
a(
	errors.length, 
	0
);


result = Schema.apply(false, {
	type:['integer', 'number']
}, errors=[]);
a(
	result, 
	0
);
a(
	errors.length, 
	0
);


result = Schema.apply(1.5, {
	type:['integer', 'number']
}, errors=[]);
a(
	result, 
	1
);
a(
	errors.length, 
	0
);



sys.puts('OK');