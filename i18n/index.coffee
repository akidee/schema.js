###
Always edit the .coffee files and then compile with coffee script
###

module.exports =
	validation_error_type:
		de: () ->
			"Ungültiger Typ"
		en: () ->
			"Invalid type"
	validation_error_minLength:
		de: (validation) ->
			"Der Text muss mindestens #{validation.schema.minLength} Zeichen haben."
		en: (validation) ->
			"Der Text muss mindestens #{validation.schema.minLength} Zeichen haben."