const express = require('express')
const morgan  = require('morgan')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

let persons = [
    { name: 'Arto Hellas', number: '040-123456' ,id: 0},
    { name: 'Martti Tienari', number: '040-123456' ,id: 1},
    { name: 'Arto Järvinen', number: '040-123456' ,id: 2},
    { name: 'Lea Kutvonen', number: '040-123456' ,id: 3}
]

morgan.token('content', (req) => JSON.stringify(req.body))

app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

app.get('/api/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const time = new Date()
  const count = Object.keys(persons).length 
  response.send(`<p>Puhelinluettelossa on ${count} henkilön tiedot </p>`+
    `<p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  if (request.body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  }else if  (request.body.number === undefined){
    return response.status(400).json({error: 'number missing'})
  }
  const index = persons.findIndex(person => person.name === request.body.name)
  if ( index !== -1 ){
    return response.status(400).json({error: 'name must be unique'})
  }
  const person = request.body
  person.id = Math.floor(Math.random()*10000)
  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})