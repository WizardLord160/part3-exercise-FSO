require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())

morgan.token('req-body', function(req, res) {
    return JSON.stringify(req.body)
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(cors())
app.use(express.static('dist'))


app.get('/', (request, response) => {
    response.send("<h1>Hello World!</h1>")
})
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {    
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
})

app.get('/info', (request, response) => {
    // const personsSize = Object.keys(persons).length
    const personsSize = 0
    const requestTimestamp = new Date()
    response.send(`
        <p>Phonebook has info for ${personsSize} people</p>
        <p>${requestTimestamp.toString()}</p>
    `);
})
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined) {
        return response.status(400).json({error: 'name missing'})
    } else if (body.number === undefined) {
        return response.status(400).json({error: 'number missing'})
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})