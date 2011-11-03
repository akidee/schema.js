/*
If the passed values are not valid, they are probably adapted or the callback is called with a validation error. If your function is synchronous, the 3rd argument of myEnv.f() must be `false`.
*/

var myEnv = require('schema')('myEnvironment', { fallbacks: 'STRICT_FALLBACKS' })

var func = myEnv.f(
	{
		type: 'array', // arguments is treated as array
		items: [
			{
				type: 'array',
				items: {
					type: 'integer',
					minimum: 10, 
					maximum: 1000
				},
				minItems: 2,
				maxItems: 10
			}
		]
	},

	true, // validate, if false, you need to call the function this way: func.validateCall()
	true, // This function is async
	
	function (numbers, callback) {

		console.log('Adapted numbers: ', numbers)
		callback(null, Math.max.apply(Math, numbers))
	}
)

func([10, -5, 1010, 3], function (e, result) {

	console.log()

	if (e)
		console.log('There are validation errors: ', e.errors)
	else
		console.log('Result: ', result)
})

func([11, 15, 980, 120], function (e, result) {

	console.log()

	if (e)
		console.log('There are validation errors: ', e.errors)
	else
		console.log('Result: ', result)
})