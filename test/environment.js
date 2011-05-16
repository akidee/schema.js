var a = require('assert'),
	s = a.strictEqual,
	d = a.deepEqual,
	utils = require('../lib/utils'),
	createEnvironment = require('../')




// ()

var env1 = createEnvironment('abc')

s(
	env1,
	createEnvironment('abc')
)

s(
	env1.id,
	'abc'
)

s(
	typeof env1.i18n,
	'function'
)

s(
	env1.locale,
	'en'
)

s(
	env1.fallbacks,
	env1.Validation.TOLERANT_FALLBACKS
)

s(
	env1.detectRecursion,
	true
)

s(
	env1.v,
	'draft-02'
)


var i18n = {
	'xyz': {
		de: 'ix ypsilon zett',
		en: 'ex why zett'
	}
}
var env2 = createEnvironment({
	i18n: i18n,
	locale: 'de',
	v: '...',
	detectRecursion: false,
	fallbacks: 'STRICT_FALLBACKS',
	other: 1
})

s(
	env2.id,
	undefined
)

s(
	env2.i18n('xyz'),
	i18n.xyz
)

d(
	Object.keys(env2.i18n('notExisting')),
	[ 'en' ]
)

s(
	env2.locale,
	'de'
)

s(
	env2.fallbacks,
	env2.Validation.STRICT_FALLBACKS
)

s(
	env2.detectRecursion,
	false
)

s(
	env2.v,
	'draft-02'
)

s(
	env2.other,
	1
)


i18n = { validation_error: { de: 'Cool, huh?' } }
var fallbacks = {
	minimum: 'setMinimum'
}
var env3 = createEnvironment({
	i18n: [ '../i18n/default', i18n ],
	detectRecursion: false,
	fallbacks: fallbacks
})

s(
	env3.i18n('validation_error'),
	i18n.validation_error
)

fallbacks = utils.extend(
	env3.Validation.STRICT_FALLBACKS,
	fallbacks
)

d(
	env3.fallbacks,
	fallbacks
)




// Environment.prototype.validateCall

var env = createEnvironment({
	
}),
	Schema = env.Schema

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


s(
	env.validateCall(add, null, 1, 5),
	6
)


try {
	env.validateCall(add, null, 'abc', 5)
}
catch (e) {

	s(
		e.errors.length,
		1
	)
	s(
		e.errors[0].attribute,
		'type'
	)
}


s(
	env.validateCall(add, null, '1.02', 5),
	6
)



// Environment.prototype.validateCallAsync

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

env.validateCallAsync(addAsync, null, '1.02', 5, 6, function (e, r1) {
	
	s(
		e instanceof Error,
		false
	)

	s(
		r1,
		6
	)
})



// Environment.prototype.f

	// schema = null, isValidating = false, isAsync = false, func

var f1 = function () {
	
},
	f2 = env.f(f1)

s(
	f1,
	f2
)

s(
	f2.SCHEMA,
	undefined
)

s(
	f2.IS_VALIDATING,
	undefined
)

s(
	f2.IS_ASYNC,
	false
)


	// schema = null, isValidating = false, isAsync = true, func

var f1 = function () {
	
},
	f2 = env.f(true, f1)

s(
	f1,
	f2
)

s(
	f2.SCHEMA,
	undefined
)

s(
	f2.IS_VALIDATING,
	undefined
)

s(
	f2.IS_ASYNC,
	true
)


	// schema, isValidating = false, isAsync = false, func

f1 = function (num) {

	return num
}

var obj = {
	a: 1,
	b: env.f(

		{
			type: 'array',
			items: [
				{
					type: 'integer',
					maximum: 1000
				}
			]
		},

		f1

	)
}

s(
	f1 === obj.b,
	true
)

s(
	obj.b.SCHEMA instanceof Schema,
	true
)

s(
	obj.b.IS_VALIDATING,
	false
)

s(
	obj.b.IS_ASYNC,
	false
)

try {

	obj.b.validate(10000)
}
catch (e) {

	s(
		e instanceof Error,
		true
	)
}


	// schema, isValidating = true, isAsync = false, isfunc

var obj = {
	a: 1,
	b: env.f(

		{
			type: 'array',
			items: [
				{
					type: 'integer',
					maximum: 1000
				}
			]
		},

		true,

		function (num) {

			return num
		}

	)
}

s(
	f1 === obj.b,
	false
)

s(
	obj.b.SCHEMA instanceof Schema,
	true
)

s(
	obj.b.IS_VALIDATING,
	true
)

s(
	obj.b.IS_ASYNC,
	false
)

r = undefined
try {

	r = obj.b(1001)
}
catch (e) {

	s(
		e instanceof Error,
		true
	)

	s(
		r,
		undefined
	)
}


	// schema, isValidating = true, isAsync = true, isfunc

var obj = {
	a: 1,
	b: env.f(

		{
			type: 'array',
			items: [
				{
					type: 'integer',
					maximum: 1000,
					fallbacks: { maximum: 'addError' }
				}
			]
		},

		true,
		true,

		function (num, _cb) {

			_cb(null, num)
		}

	)
}

s(
	f1 === obj.b,
	false
)

s(
	obj.b.SCHEMA instanceof Schema,
	true
)

s(
	obj.b.IS_VALIDATING,
	true
)

s(
	obj.b.IS_ASYNC,
	true
)

obj.b(1001, function (e, r) {

	s(
		e instanceof Error,
		true
	)

	s(
		r,
		undefined
	)
})




console.log('Passed')
