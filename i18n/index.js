(function() {
  module.exports = {
    validation_error_type: {
      de: function() {
        return "Ungültiger Typ";
      },
      en: function() {
        return "Invalid type";
      }
    },
    validation_error_minLength: {
      de: function(validation) {
        return "Der Text muss mindestens " + (validation.schema.minLength) + " Zeichen haben.";
      },
      en: function(validation) {
        return "Der Text muss mindestens " + (validation.schema.minLength) + " Zeichen haben.";
      }
    }
  };
}).call(this);
