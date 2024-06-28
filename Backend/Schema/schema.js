const mongo = require("mongoose")
const room = mongo.Schema({
    state: {
        type: String,
        require: true
    },
    users: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.length <= 2; // Allow up to 2 elements
            },
            message: 'users array must contain exactly 2 elements'
        }
    },
    category:{
        type: String,
        require: true
    },
    interest:{
        type: String
    }
},{timestamps:true})

module.exports.room = mongo.model('Room', room)
