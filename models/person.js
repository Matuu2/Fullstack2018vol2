const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
  }

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true })

const personSchema = mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

personSchema.statics.format = function(person){
    return {
        name: person.name,
        number: person.number,
        id: person.id
    }
}
const Person = mongoose.model('Person', personSchema);

module.exports = Person