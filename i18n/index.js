(function() {
  var exports;
  require('underscorex');
  /*
  Always edit the .coffee files and then compile with coffee script
  */
  exports = module.exports = function(id) {
    return exports[id] || id;
  };
  _.extend(exports, {
    validation_error: {
      de: function() {
        return "Diese Instanz ist nicht gültig";
      },
      en: function() {
        return "This instance is not valid";
      }
    },
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
        return "Der Text muss mindestens " + validation.schema.minLength + " Zeichen haben.";
      },
      en: function(validation) {
        return "Der Text muss mindestens " + validation.schema.minLength + " Zeichen haben.";
      }
    }
  });
}).call(this);
