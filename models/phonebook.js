require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phoneBookSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: [3, 'Name must be at least 3 characters long'],
      required: [true, 'Name is required']
    },
    number: {
        type: String,
        required: [true, 'Number is required'],
        validate: {
            validator: function(v) {
                // Check if the number has exactly 10 characters (ignoring spaces)
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        },
        // Preprocess the number to remove spaces before saving
        set: v => v.replace(/\s+/g, '') // Remove spaces
    }
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('PhoneBook', phoneBookSchema)