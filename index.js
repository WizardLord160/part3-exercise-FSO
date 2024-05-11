const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())

morgan.token('req-body', function(req, res) {
    return JSON.stringify(req.body)
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const generateId = () => {
    const ceiling = 1000000
    const floor = 0
    const randomID = Math.random() * (ceiling - floor) + floor
    return randomID
}

app.get('/', (request, response) => {
    response.send("<h1>Hello World!</h1>")
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    singlePerson = persons.find(person => person.id === id)
    if (singlePerson) {
        response.json(singlePerson)
    } else {
        response.status(404).end()
    }
})
app.get('/info', (request, response) => {
    const personsSize = Object.keys(persons).length
    const requestTimestamp = new Date()
    response.send(`
        <p>Phonebook has info for ${personsSize} people</p>
        <p>${requestTimestamp.toString()}</p>
    `);
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'person already exists'
        })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})