module.exports = function () {

	var Schema = this.Schema,
		Validation = this.Validation
	
	var rawSchema = {

		id: 'jsonSchemaCore',
		title: 'JSON Schema Core Schema',
		description: "This is the JSON Schema for JSON Schemas.",
		type: "object",
	
		properties: {
	
	
			// *
	
			type: {
		
				type: ["string", "array"],
				items: {
			
					type: "string",
					enum: {"$ref": "#.properties.type.enum"}
				},
				uniqueItems: true,
				description: "This is a type definition value. This can be a simple type, or a union type",
				enum: ["string", "object", "array", "boolean", "number", "integer", "null", "any"],
				minItems: 2,
				optional: true,
				"default": "any",
					pre: 'addToRefs',
					labels: {
				
						de: {
					
							string: 'Text',
							object: 'Objekt',
							array: 'Liste',
							boolean: 'wahr/falsch',
							number: 'Zahl',
							integer: 'ganze Zahl',
							'null': 'undefiniert'
						},
						en: {
					
						
						}
					}
			},
		
			id: {
		
				type: "string",
				optional: true,
				minLength: 1,
				pattern: "[^\\.#]",
				description: "A globally unique ID for this schema. It can be used to reference the schema from another one."
			},
		
			optional: {
		
				type: "boolean",
				description: "This indicates that the instance property in the instance object is not required.",
				optional: true,
				"default": false,
					pre: 'addToRefs'
			},
		
			enum: {
				type: "array",
				optional: true,
				description: "This provides an enumeration of possible values that are valid for the instance property. It goes only for the first type, if type is an array of types.",
				minItems: 1,
				uniqueItems: true
			},
		
			description: {
		
				type: "string",
				optional: true,
				description: "This provides a description of the purpose the instance property. The value can be a string or it can be an object with properties corresponding to various different instance languages (with an optional default property indicating the default description).",
					pre: 'addToRefs'
			},
		
			title: {
		
				type: "string",
				optional: true,
				description: "This provides the title of the property",
					pre: 'addToRefs'
			},
		
			"default": {
				type: "any",
				optional: true,
				description: "This indicates the default for the instance property.",
					pre: 'addToRefs'
			},
		
			// should go with enum
			options: {
		
				type: "array",
				optional: true,
				items: {
					type: "object",
					properties: {
						label: {
							type: "string",
							optional: true
						},
						value: {
							type: "any"
						}
					}
				},
					pre: 'addToRefs'
			},
		
			extends: {
		
				// You cannot do this, because the schema itself is not optional
				// and so #.properties.extends does inherit from core schema, but
				// isn't as restrictive. So you cannot validate extends in a schema
				/// Better solution needed!
				//extends: {"$ref": "#"},
				type: 'object',
				optional: true,
					pre: 'addToRefs'
			},
		
			// must be in object
			requires: {
		
				type: ["string", "object"],
				additionalProperties: {"$ref": "#"},
				optional: true,
				description: "indicates a required property or a schema that must be validated if this property is present",
					pre: 'addToRefs'
			},
		
				// just for schema schemas ;)
				nonStandard: {
			
					type: "boolean",
					optional: true,
					"default": false,
					nonStandard: true
				},
		
				pre: {
		
					// Allow closures
					type: ['string', 'array', 'any'],
					items: {
				
						type: ['string', 'any']
					},
					optional: true,
					description: "One or several prefix adapters identified by plugin IDs",
					nonStandard: true,
						pre: 'addToRefs'
				},

				post: {
		
					// Allow closures
					type: ['string', 'array', 'any'],
					items: {
				
						type: ['string', 'any']
					},
					optional: true,
					description: "One or several postfix adapters identified by plugin IDs",
					nonStandard: true,
						pre: 'addToRefs'
				},
			
				fallbacks: {
			
					type: "object",
					additionalProperties: {
				
						type: "string",
						description: "Identifier for a adapter function that will be executed if a constraint is violated"
					},
					description: "Fallback object, with property names = schema property names",
					nonStandard: true,
						pre: 'addToRefs'
				},
			
		
		
			// object
		
			properties: {
		
				type: "object",
				additionalProperties: {"$ref": "#"},
				description: "This is a definition for the properties of an object value",
				optional: true,
				"default": {},
					pre: 'addToRefs'
			},
		
		
		
			// array
		
			items: {
		
				type: ["object", "array"],
				properties: {"$ref": "#.properties"},
				items: {"$ref": "#"},
				description: "When the value is an array, this indicates the schema to use to validate each item in an array",
				optional: true,
					pre: [
						'instantiateSchema',
						'addToRefs'
					]
			},
		
			maxItems: {
		
				type: "integer",
				optional: true,
				description: "When the instance value is an array, this indicates maximum number of items.",
				minimum: 0,
				pre: 'addToRefs'
			},
		
			minItems: {
		
				type: "integer",
				optional: true,
				description: "When the instance value is an array, this indicates minimum number of items.",
				minimum: 0,
					pre: 'addToRefs'
			},
		
		
		
			// object, array
		
			additionalProperties: {
		
				type: ["boolean", "object"],
				properties: {"$ref": "#.properties"},
				description: "This provides a default property definition for all properties that are not explicitly defined in an object type definition.",
				optional: true,
				"default": true,
					pre: [
						'instantiateSchema',
						'addToRefs'
					]
			},
		
		
		
			// number, integer
		
			minimum: {
		
				type: "number",
				optional: true,
				description: "This indicates the minimum value for the instance property when the type of the instance value is a number.",
					pre: 'addToRefs'
			},
		
			minimumCanEqual: {
		
				type: "boolean",
				optional: true,
				description: "If the minimum is defined, this indicates whether or not the instance property value can equal the minimum.",
				"default": true,
					pre: 'addToRefs'
			},
		
			maximum: {
		
				type: "number",
				optional: true,
				description: "This indicates the maximum value for the instance property when the type of the instance value is a number.",
					pre: 'addToRefs'
			},
		
			maximumCanEqual: {
		
				type: "boolean",
				optional: true,
				description: "If the maximum is defined, this indicates whether or not the instance property value can equal the maximum.",
				"default": true,
					pre: 'addToRefs'
			},
		
			maxDecimal: {
		
				type: "integer",
				optional: true,
				description: "This indicates the maximum number of decimal places in a floating point number.",
					pre: 'addToRefs'
			},
		
		
		
			// string
		
			pattern: {
		
				// Allow JS RegExp instances
				type: ['string', 'object'],
				format: "regex",
				description: "When the instance value is a string, this provides a regular expression that a instance string value should match in order to be valid.",
				optional: true,
					pre: [
						'addToRefs',
						function (instance, walker) {
				
							if (instance instanceof RegExp) return instance;
							if (typeof instance === 'string') return new RegExp(instance);
					
							return instance;
						}
					]
			},
		
			maxLength: {
		
				type: "number",
				optional: true,
				description: "When the instance value is a string, this indicates maximum length of the string.",
					pre: 'addToRefs'
			},
		
			minLength: {
		
				type: "number",
				optional: true,
				description: "When the instance value is a string, this indicates minimum length of the string.",
				pre: 'addToRefs'
			},
		
		
		
			// string, number, integer
		
			format: {
				type: "string",
				optional: true,
				description: "This indicates what format the data is among some predefined formats which may include:\n\ndate - a string following the ISO format \naddress \nschema - a schema definition object \nperson \npage \nhtml - a string representing HTML",
				pre: 'addToRefs'
			}
		},
	
		pre: [
			'instantiateSchema',
			'addToRefs'
		]
	};

	var jsonSchemaCore;
	(jsonSchemaCore = new Schema(rawSchema))
		.setFallbacks(Validation.STRICT_FALLBACKS)

	for (var key in jsonSchemaCore.properties) {

		(jsonSchemaCore.properties[key] = new Schema(jsonSchemaCore.properties[key]))
			.setFallbacks(Validation.STRICT_FALLBACKS)
	}

	(jsonSchemaCore.properties.type.items = new Schema(jsonSchemaCore.properties.type.items))
		.setFallbacks(Validation.STRICT_FALLBACKS)
	
	jsonSchemaCore.properties.type.items.enum = jsonSchemaCore.properties.type.enum

	jsonSchemaCore.properties.id.pattern = new RegExp(jsonSchemaCore.properties.id.pattern);

	(jsonSchemaCore.properties.options.items = new Schema(jsonSchemaCore.properties.options.items))
		.setFallbacks(Validation.STRICT_FALLBACKS)

	jsonSchemaCore.properties.requires.additionalProperties = jsonSchemaCore;

	(jsonSchemaCore.properties.pre.items = new Schema(jsonSchemaCore.properties.pre.items))
		.setFallbacks(Validation.STRICT_FALLBACKS);

	///
	(jsonSchemaCore.properties.post.items = new Schema(jsonSchemaCore.properties.post.items))
		.setFallbacks(Validation.STRICT_FALLBACKS);

	(jsonSchemaCore.properties.fallbacks.additionalProperties = new Schema(jsonSchemaCore.properties.fallbacks.additionalProperties))
		.setFallbacks(Validation.STRICT_FALLBACKS)

	jsonSchemaCore.properties.properties.additionalProperties = jsonSchemaCore

	//Luhmannesk moment
	//jsonSchemaCore.properties.extends.extends = jsonSchemaCore

	jsonSchemaCore.properties.items.properties = jsonSchemaCore.properties

	jsonSchemaCore.properties.items.items = jsonSchemaCore

	jsonSchemaCore.properties.additionalProperties.properties = jsonSchemaCore.properties

	this.schemaSchema = jsonSchemaCore
}
