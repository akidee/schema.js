# schema.js

* implements data schema validation and adaptation according to [JSON Schema](http://json-schema.org/) ([draft 2](http://tools.ietf.org/html/draft-zyp-json-schema-02)) for JavaScript (CommonJS).
* serves as both validator and documentation of your project's data models
* is sophisticated: environments, recursion detection, tolerant value adaptation, extendable
* makes your development more agile. You don't need to unit test your validators any more.

## Installation

```sh
npm install schema
```

## API

### Environment

The environment is a context, where your schemas and validations live in. You need to create an environment before creating your schemas to define some default settings that will affect all schemas created in this environment:

```js
var myEnv = require('schema')('envIdentifier', options)
```

* The identifier is optional but recommended to retrieve the same environment - without options - in another script.
* `options` is an object that can have the following keys:
  * `'i18n'` is a list of module identifiers or i18n packages that will be used inside this environment. To omit all messages in the validation errors, just use `[]`. [Example for an i18n module](http://github.com/akidee/schema.js/blob/master/i18n/default.js)
Default: `[ '../i18n/default' ]`
  * `'fallbacks'` defines the default fallbacks that are used when a schema is defined without the `"fallbacks"` attribute. Options: `'TOLERANT_FALLBACKS'`, `'STRICT_FALLBACKS'` or any other legal definition of the `"fallbacks"` attribute. Default: `'TOLERANT_FALLBACKS'`
  * `'v'`: Default and only supported option: `'draft-02'`
  * `'detectRecursion'` defines whether recursions should be detected on validation. Not recommended to set to `false`. Default: `true`

### myEnv.Schema

Instances contain a JSON Schema:
	
```js
var schema = myEnv.Schema.create({
	type: 'object',
	properties: {

		q: {
			type: 'string',
			minLength: 1,
			maxLength: 200,
			'default': '',
			fallbacks: {
				maxLength: 'truncateToMaxLength'
			}
		},
		
		hl: {
			type: 'string',
			enum: [ 'en', 'de', 'fr' ],
			'default': 'en',
			pre: function (value) {
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
		
		order: {
			type: 'string',
			enum: [ 'name', 'date' ],
			'default': 'date'
		}
	},
	
	additionalProperties: false
})
```

#### Extensions

* `'fallbacks'` ...
* `'pre'` handler called _before_ applying this schema. See example above.
* `'post'` handler called _after_ applying this schema.

#### Still not supported

* `'unqiueItems'`
* `'divisibleBy'`
* `'disallow'`
* `'type'`: usage of schemas
* Hyper Schema
* URI references

#### Irrelevant for validation

* `'format'`

When writing a new schema, you can use the file [PROPERTY_OVERVIEW_02](http://github.com/akidee/schema.js/blob/master/PROPERTY_OVERVIEW_02) to get a quick overview over all supported properties.

### myEnv.Validation

```js
var validation = schema.validate({

	q: 'OK',
	start: -5,
	num: -100.99,
	xyz: 'additionalProperty'
})

var assert = require('assert')

assert.deepEqual(
	validation.instance,
	{
		q: 'OK',
		start: 0,
		order: 'date',
		hl: 'en'
	}
)

assert.strictEqual(
	validation.isError(),
	false
)
```

### myEnv.f

With this little utility, you create a secure JavaScript function with an implicit schema.

Example: http://github.com/akidee/schema.js/blob/master/examples/myEnv.f.js

## Dependencies

* JavaScript engine
* CommonJS implementation, e.g. [node.js](http://nodejs.org/) on the server, [Yabble](http://github.com/akidee/yabble) on the client
