var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());


app.post('/todos',(req, res) =>{
    var todo = new Todo({
        text:req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e.message);
    })
});

app.get('/todos', (req, res)=>{

});
app.listen(3000, () =>{
    console.log('Starded on port 3000');
})

// var newTodo = new Todo({text:'fomdaze ee'});

// newTodo.save().then((doc)=>{
//     console.log('Saved todo', doc)
// }).catch((e)=>{
//     console.log('Cant save todo', e);
// });

//User email require trim string minleng 1

