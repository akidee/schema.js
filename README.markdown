Tolerant value adaptation and validation conforming to JSON Schema for node.js ( http://tools.ietf.org/html/draft-zyp-json-schema-02 )
Version 0.1


# Standard

## Not supported

* 5.13 (unqiueItems)
* 5.20 (format) - validation
* 5.23 (divisibleBy)
* 5.24 (disallow)
* 6 (Hyper Schema)
	
## Planned support

* 5.25 (extends)
	
## Additions

* apply - user defined apply function
* fitMinMax - make number fit minimum/maximum, if minimum/maximumCanEqual is not false
	
	
# Platforms

It's currently optimized for node.js.
	
	
# Example - Google like search parameters

	var assert = require('assert'),
		Schema = require('schema'); // Schema is a contructor
	
	var result, errors, schema = {
	
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
	
	assert.strictEqual(
		errors.length,
		0
	);

You find this example in test.js