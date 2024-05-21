require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

// Create a custom morgan token, named 'req-body', to use for logging
morgan.token('req-body', function(req, res) {
    return JSON.stringify(req.body)
})

app.use(express.static('dist')) // Loads frontend (single-page application)
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body')) // HTTP request logger
app.use(cors()) // Allows cross-origin requests


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
app.get('/api/persons', (request, response, next) => {
    // Get data of all people
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
    // Find specific person by id
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})
app.get('/info', (request, response) => {
    // TODO: Return information about the database
    Person.countDocuments({})
        .then(personsSize => {
            const requestTimestamp = new Date()
            response.send(`
                <p>Phonebook has info for ${personsSize} people</p>
                <p>${requestTimestamp.toString()}</p>
            `)
        })
        .catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
    // Deletes a specific person by id
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
app.post('/api/persons', (request, response, next) => {
    // Adds a person to the database
    const body = request.body

    // Create new person according to person schema
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    // Save the person to the database
    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    // Update just the number
    // const newNumber = {
    //     ...body,
    //     number: body.number
    // }

    // Update the person with the new number, specifying 'new' to return updated document
    // Validation doesn't work on updates by default, so explicitly configured here
    // Requires query, not schema, context for validator to be able to access specific fields of the document
    Person.findByIdAndUpdate(
        request.params.id,
        { ...body, number: body.number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    // Middleware to handle requests that conclude with error
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error:'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
// Should be the last loaded middleware, also after all routes already registered
app.use(errorHandler)

// Run the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})