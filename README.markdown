# schema.js

Modular data schema validation and adaptation according to [JSON Schema](http://json-schema.org/) for JavaScript (CommonJS). In development.

The following documents were regarded:

* http://tools.ietf.org/html/draft-zyp-json-schema-02

* http://groups.google.com/group/json-schema/web/json-schema-proposal-working-draft

## Overview

In schema.js there are 3 classes:

* Schema: Instances contain a JSON Schema.

		var Schema = require('schema');
	
		// mySchema instanceof Schema === true
		var mySchema = Schema.create({type:'integer'});

* Schema.Validation: The validation done with a schema and an instance.

		// validation instanceof Schema.Validation === true
		var validation = mySchema.validate(5);
	
	A Schema.Validation instance implicits a finished validation, that has several properties:

	1. instance - the passed instance (adapted or not, depending of your schema settings)
	2. errors - array of Schema.Validation.Error instances
	3. validation.isError() - returns true if 1 or more errors occured

* Schema.Validation.Error: validation Error - an instance has the following properties:

	1. path - the path in the object tree
	2. name - the schema property that was violated
	3. message - localized (still not supported)

When writing a new schema for your project, your can use the file PROPERTY_OVERVIEW to get a quick overview over all supported properties.

## schema.js is different

### Validation tolerance

By default, it tries to adapt your data to the schema. Example: '5' will be casted to 5, if the schema requires the type 'integer'. But if you want to validate strictly, define your schema like this:

	var mySchema = Schema.create({type:'integer', fallbacks: Schema.STRICT_FALLBACKS});
	
### Modular architecture
	
Internally, schema.js uses checkers and fallbacks. Checkers check strictly, if an instance does violate the schema. If a schema property is violated, a fallback will be called, that can try to adapt the instance or push an error, if it fails.
Additionally, you can implement own adapters and fallbacks. Adapters can be used to change a value before the validation starts. (More documentation soon.)

#### Schema.STRICT_FALLBACKS

In any case an error will be pushed, if a schema property is violated.

#### Schema.TOLERANT_FALLBACKS

If a property is violated, a tolerant callback will be called that tries to adapt the value to the schema. If this fails, an error will be pushed.

### Sophisticated

Recursions are detected for both schemas and objects. So no endless stacks here. 

## Dependencies

* JavaScript engine
* CommonJS implementation (e.g. node.js)
* extensions.js ( http://github.com/akidee/extensions.js )

## Still not supported

* unqiueItems
* format: including validation
* divisibleBy
* disallow
* Hyper Schema
* $ref with URLs
* type: usage of schemas

## Extended example: Google like search parameters

	var assert = require('assert'),
		Schema = require('schema');
	
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


You see, that you can even define fallbacks for single properties. (More documentation later.)
You find this example in test.js.


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