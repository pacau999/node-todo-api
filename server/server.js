const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
require('newrelic');


var {mongoose} = require('./db/mongoose');
var {Todo, Types} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


app.post('/todos',(req, res) =>{
    var todo = new Todo({
        text:req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        return res.status(400).send(e.message);
    })
});

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }).catch((e)=>{
        return  res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res)=> {
   var id = req.params.id;
   if(!Types.ObjectId.isValid(id)){
    return  res.status(404).send();
   }
   
   Todo.findById(id).then((todo) => {
    if(!todo){
        return  res.status(404).send();
    }
    res.send(todo);
   }).catch((e)=>{
        return res.status(400).send();
   });

});

app.delete('/todos/:id',(req, res)=>{
    var id = req.params.id;
    if(!Types.ObjectId.isValid(id)){
        return res.status(404).send();
    }
    
    Todo.findByIdAndRemove(id).then((todo) => {
     if(!todo){
        return res.status(404).send();
     }
     res.send(todo);
    }).catch((e)=>{
        return res.status(400).send();
    });
});

app.patch('/todos/:id',(req,res) =>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);
    if(!Types.ObjectId.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed - false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id,{$set: body}, {new:true}).then((todo)=>{
        if(!todo){
            res.status(404).send();
        }

        res.send(todo);
    }).catch((e)=>{

    });
});
app.listen(port, () =>{
    console.log('Starded on port: ',port);
});



module.exports ={app};

// var newTodo = new Todo({text:'fomdaze ee'});

// newTodo.save().then((doc)=>{
//     console.log('Saved todo', doc)
// }).catch((e)=>{
//     console.log('Cant save todo', e);
// });

//User email require trim string minleng 1

