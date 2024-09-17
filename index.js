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

app.get('/info', (req, res, next) => {
    PhoneBook.countDocuments({})
    .then(count => {
        const date = new Date();
        const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const weekday = weekdays[date.getDay()]; 

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const am_pm = date.getHours() >= 12 ? 'PM' : 'AM';

        const formattedDate = `${weekday} ${day}-${month}-${year} ${hours}:${minutes} ${am_pm} IST`;

        res.send(
            `<pre>
                <p>Phone-Book has info of ${count} people</p>
                <p>${formattedDate}</p>
            </pre>`
        );
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id' , (req , res , next) => {
    PhoneBook.findByIdAndDelete(req.params.id)
    .then(result => {
        res.send({
            message : "PhoneBook deleted succesfully"
        }).status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
  
    const person = new PhoneBook({
      name: body.name,
      number: body.number
    });
  
    person.save()
      .then(savedPerson => res.json(savedPerson))
      .catch(error => next(error));  // Pass the error to the error handler
});

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;
  
    const updatedPerson = { name, number };
  
    PhoneBook.findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        if (updatedPerson) {
          res.json(updatedPerson);
        } else {
          res.status(404).end();
        }
      })
      .catch(error => next(error));  // Pass the error to the error handler
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message });
    }
  
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT ,() => {
    console.log(`http://localhost:${PORT}`);
})