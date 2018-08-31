const express = require('express')
const morgan  = require('morgan')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const Person = require('./models/person')

morgan.token('content', (req) => JSON.stringify(req.body))

app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))


app.get('/api/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
})

app.get('/api/info', (request, response) => {
  const time = new Date()
  Person
    .find({})
    .then(persons => {
      response.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot </p>`+
      `<p>${time}</p>`)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(() => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (request, response) => {

  const person = {
    name: request.body.name,
    number: request.body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person )
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons/', (request, response) => {
  if (request.body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }else if  (request.body.number === undefined){
    return response.status(400).json({ error: 'number missing' })
  }
  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })
  person
    .save()
    .then(savedperson => {
      response.json(Person.format(savedperson))
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})