var a = require('assert'),
	s = a.strictEqual,
	d = a.deepEqual,
	env = require('../')(),
	Schema = env.Schema
	



// new Schema()

var schema = new Schema('{ "type": "string", "id": "identifier" }')
s(
	schema.type,
	'string'
)

s(
	schema.id,
	'identifier'
)

var schema2 = new Schema(schema)
s(
	schema,
	schema2
)

schema = new Schema({ type: 'integer' })

s(
	/^[0-9]+$/.test(schema.id),
	true
)

s(
	Schema.instances['identifier'],
	schema2
)

s(
	Schema.instances[schema.id],
	schema
)




// Schema.prototype.setFallbacks()

s(
	schema.setFallbacks('STRICT_FALLBACKS'),
	schema
)

s(
	schema.fallbacks,
	env.Validation.STRICT_FALLBACKS
)

schema.setFallbacks()

s(
	schema.fallbacks,
	env.Validation.TOLERANT_FALLBACKS
)

schema.setFallbacks({
	maximum: 'addError'
})

s(
	schema.fallbacks.maximum,
	'addError'
)




// Schema.create()

schema = Schema.create('{\
	"type": "object",\
	"properties": {\
		"a": {\
			"type": "string"\
		}\
	}\
}')

s(
	schema instanceof Schema,
	true
)

s(
	schema.properties.a instanceof Schema,
	true
)

var data = {
	"type": "object",
	"properties": {
		"a": {
			"type": "string"
		}
	}
}
schema = Schema.create(data)

s(
	schema instanceof Schema,
	true
)

s(
	schema.properties.a instanceof Schema,
	true
)




// Schema.createSeveral()

var dict = {

	a: { type: 'string', id: 'A' },
	b: { type: 'object' }
}
var dict_ = Schema.createSeveral(dict)

s(
	dict,
	dict_
)

s(
	dict.a.id,
	'A'
)

s(
	dict.b.id,
	'b'
)

s(
	Object.keys(dict).length,
	2
)




// Schema.resolveRefs()

var s1 = Schema.create({
	id: 's1',
	type: 'object',
	properties: {
		a: { $ref: 's2' }
	}
})

var s2 = Schema.create({
	id: 's2',
	type: 'object',
	properties: {
		b: { $ref: 's1' }
	}
})

Schema.resolveRefs()

s(
	s1.properties.a,
	s2
)

s(
	s2.properties.b,
	s1
)




console.log('Passed')
