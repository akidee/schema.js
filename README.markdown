# schema.js

Modular data schema validation and adaptation according to JSON Schema for JavaScript (CommonJS).

The following documents were regarded:
* http://tools.ietf.org/html/draft-zyp-json-schema-02
* http://groups.google.com/group/json-schema/web/json-schema-proposal-working-draft

## Dependencies

* JavaScript engine
* CommonJS implementation (e.g. node.js)
* extensions.js ( http://github.com/akidee/extensions.js )

## Still not supported

* unqiueItems
* format - including validation
* divisibleBy
* disallow
* identity - cannot easily be validated
* Hyper Schema
	
## Additions

### Plugins

You can define your own plugins. There are two types:

1) fallbacks for JSON Schema check fails
2) adapters

Here you see 2 examples from plugins/default.js - the first one is a fallback, the second one is an adapter:




## Example: Google like search parameters

	var assert = require('assert'),
		Schema = require('schema');
	
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


## License

(The MIT License)

Copyright (c) 2009 Andreas Kalsch &lt;andreaskalsch@gmx.de&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.