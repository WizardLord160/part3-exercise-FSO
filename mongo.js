// const mongoose = require('mongoose')

// if (process.argv.length != 3 && process.argv.length != 5) {
//     console.log('Invalid input, use "node mongo.js {password} {name} {number}"')
//     console.log('If the name has whitespace, include it in quotes like so: "first last"')
//     console.log('If you want to view the entire phonebook, do not include the name and number parameters.')
//     process.exit(1)
// }

// const password = process.argv[2]
// const newName = process.argv[3]
// const newNumber = process.argv[4]

// const url =
//     `mongodb+srv://wizardlord160:${password}@clusterphonebook.ycjzxut.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=ClusterPhonebook`

// mongoose.set('strictQuery',false)

// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// })

// const Person = mongoose.model('Person', personSchema)

// if (process.argv.length == 3) {
//     console.log("phonebook:")
//     Person.find({}).then(result => {
//         result.forEach(person => {
//           console.log(person.name, person.number)
//         })
//         mongoose.connection.close()
//     })
// } else {
//     const person = new Person({
//         name: newName,
//         number: newNumber,
//     })
    
//     person.save().then(result => {
//         console.log(`added ${newName} number ${newNumber} to phonebook`)
//         mongoose.connection.close()
//     })
// }