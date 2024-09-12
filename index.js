const express = require('express');
const app = express();
app.use(express.json())

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => Number(p.id))) 
      : 0

    return String(maxId + 1)
}

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": "5",
        "name": "Vikas Pal", 
        "number": "9594781303"
    }
]


app.get('/', (req, res) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()
})


app.delete('/api/persons/:id' , (req , res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id)
    res.send('PhoneBook deleted succesfully');
    res.status(204).end()
});

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name){
        return res.sendStatus(400).json({
            error : 'name missing'
        })
    }

    const person = {
        id : generateId(),
        name : body.name,
        number : body.number,
    }

    persons = persons.concat(person)
    res.json(person)
})
  

const PORT = 3000;
app.listen(PORT ,() => {
    console.log(`http://localhost:${PORT}`);
})