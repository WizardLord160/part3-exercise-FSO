const mongoose = require('mongoose')

// Data does not have to strictly follow schema
mongoose.set('strictQuery', false)

// Obtain database URL (password included)
const url = process.env.MONGODB_URI
console.log('connecting to', url)

// Connect to MongoDB
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error.message)
    })

function phoneFormatValidator(number) {
    // Validate phone number to be integers in XXX-XXX-XXXX format
    return (/\d{3}-\d{3}-\d{4}/.test(number) || /\d{2}-\d{7}/.test(number) || /\d{3}-\d{8}/.test(number))
}
// Data schema for a person
const personSchema = new mongoose.Schema({
    // Make name required and three characters minimum
    name: {
        type: String,
        minLength: 3,
        required: [true, 'Name required']
    },
    number: {
        type: String,
        validate: {validator: phoneFormatValidator, message: props => `${props.value} is not a valid phone number!`},
        required: [true, 'Phone number required']
    },
})

// Set/define options for the person schema, specifically in instance when it's converted to JSON
personSchema.set('toJSON', {
    // Transform/modify the JSON data itself
    transform: (document, returnedObject) => {
        // Turn the id from a binary data datatype into a string
        returnedObject.id = returnedObject._id.toString()
        // Remove the old id and versioning (not needed)
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)