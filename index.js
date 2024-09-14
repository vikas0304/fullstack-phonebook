const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();
const PhoneBook = require('./models/phonebook')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))


app.get('/', (req, res) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
    PhoneBook.find({})
    .then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'malformatted id' });
    }

    PhoneBook.findById(id)
    .then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).send({ error: 'server error' });
    });
});

app.get('/info', (req, res) => {
    const date = new Date()
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const weekday = weekdays[date.getDay()]; // Get the current day (0 = Sunday, 1 = Monday, etc.)

    // Manually format the date to DD-MM-YY format
    const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month with leading zero
    const year = String(date.getFullYear()).slice(-2); // Last 2 digits of the year
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0'); // Convert 24-hour to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes with leading zero
    const am_pm = date.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    
    // Construct the full formatted string
    const formattedDate = `${weekday} ${day}-${month}-${year} ${hours}:${minutes} ${am_pm} IST`;
    res.send
        (`
            <pre>
                <p>Phone-Book has info of ${persons.length}</p>
                <p>${formattedDate}</p>
            </pre>
        `)
})


app.delete('/api/persons/:id' , (req , res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id)
    res.send('PhoneBook deleted succesfully');
    res.status(204).end()
});

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body.name || !body.number === undefined){
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new PhoneBook({
        name : body.name,
        number : body.number
    })

    person
    .save()
    .then(savedPerson => {
        res.json(savedPerson)
    })
})
  

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' })
//   }
  
// app.use(unknownEndpoint)

const PORT = process.env.PORT || 3000;
app.listen(PORT ,() => {
    console.log(`http://localhost:${PORT}`);
})