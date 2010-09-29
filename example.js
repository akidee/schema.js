var Schema = require('schema');

// mySchema instanceof Schema === true
var mySchema = Schema.create({type:'integer'});
  
// validation instanceof Schema.Validation === true
var validation = mySchema.validate(5);