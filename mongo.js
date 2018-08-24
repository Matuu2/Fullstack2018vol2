const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
  }

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
})

if ( process.argv.length === 2 ){
    Person
        .find({})
        .then(result => {
            console.log('Puhelinluettelo:')
            result.forEach(person => {
            console.log(person.name,person.number)
            })
        mongoose.connection.close()
        })
}else{
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3],
        id: Math.floor(Math.random()*10000)
    })
    person
        .save()
        .then(result => {
            console.log(`Lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`)
            mongoose.connection.close()
        })    
}
