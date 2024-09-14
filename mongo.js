const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> [name] [number]')
  process.exit(1)
}

const username = 'phoneboo'
const password = process.argv[2]

const url =
  `mongodb+srv://${username}:${password}@cluster0.eslzs.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhoneBook = mongoose.model('PhoneBook', phoneBookSchema)

if (process.argv.length === 3) {
  // If only password is provided, list all contacts
  PhoneBook.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error fetching contacts:', error)
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // If name and number are provided, add a new contact
  const name = process.argv[3]
  const number = process.argv[4]

  const newContact = new PhoneBook({
    name: name,
    number: number,
  })

  newContact.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error saving contact:', error)
    mongoose.connection.close()
  })
} else {
  console.log('Please provide the correct arguments: node mongo.js <password> [name] [number]')
  mongoose.connection.close()
}
