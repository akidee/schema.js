# schema.js

* ... implements data schema validation and adaptation according to [JSON Schema](http://json-schema.org/) ([draft 2](http://tools.ietf.org/html/draft-zyp-json-schema-02)) for JavaScript (CommonJS).
* ... serves as both documentation and validator of your data models
* ... is sophisticated: environments, recursion detection, tolerant value adaptation, extendable
* ... makes your work more agile. You don't need to unit test your validators any more.

The following documents were regarded:

* http://tools.ietf.org/html/draft-zyp-json-schema-02
* http://groups.google.com/group/json-schema/web/json-schema-proposal-working-draft

## API (currently not stable, since this is the restruct branch soon to be v0.2.0)

### Environment

The environment is a context, where your schemas and validations live in. You need to create an environment before creating your schemas to define some default settings that will affect all schemas created in this environment:

```js	
var myEnv = require('schema')('envIdentifier', options)

The identifier is optional but recommended to retrieve the same environment - without any options - in another script.
`options` is an object that can have the following keys:
* `i18n` is a list of module identifiers or i18n packages that will be used inside this environment. To omit all messages in the validation errors, just use `[]`. Example for an i18n module: http://github.com/akidee/i18n/default.js. Default: `[ '../i18n/default' ]`
* `fallbacks` defines the default fallbacks that are used when a schema is defined without the `fallbacks` attribute. Options: `'TOLERANT_FALLBACKS'`, `'STRICT_FALLBACKS'` or any other legal definition of the `fallbacks` attribute. Default: `'TOLERANT_FALLBACKS'`
* `v`: Default and currently only option: `'json-schema-draft-02-schema.js'`
* `detectRecursion` defines whether schema and value recursions should be detected. Not recommended to set to `false`. Default: `true`

### myEnv.Schema

Instances contain a JSON Schema:
	
	var mySchema = Schema.create({type:'integer'})

When writing a new schema for your project, you can use the file PROPERTY_OVERVIEW_02 to get a quick overview over all supported properties.

### myEnv.Validation

	var myValidation = mySchema.validate(5)
	
myValidation implicits a finished validation:

	1. instance - the passed instance (adapted or not, depending of your schema settings)
	2. errors - array of Schema.Validation.Error instances
	3. validation.isError() - returns true if 1 or more errors occured

### myValidation.Error

myValidation.errors is an array with `myValidation.Error` instances:

	1. path - the path in the object tree
	2. name - the schema property that was violated
	3. message - localized (still not supported)

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
