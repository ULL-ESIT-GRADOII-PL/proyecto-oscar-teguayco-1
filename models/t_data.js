var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
    
var t_data = new Schema({
    name: {
        type: String,
        unique: true
    },
    content: String
});


module.exports = mongoose.model('TData', t_data);