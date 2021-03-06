const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
if(process.env.NEW_RELIC_APP_NAME){
    require('newrelic');
}


var {mongoose} = require('./db/mongoose');
var {Todo, Types} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


app.post('/todos',authenticate, (req, res) =>{
    var todo = new Todo({
        text:req.body.text,
        _creator:req.user._id
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }).catch((e)=>{
        return res.status(400).send(e.message);
    })
});

app.get('/todos',authenticate, (req, res)=>{
    Todo.find({
        _creator:req.user._id
    }).then((todos)=>{
        res.send({todos});
    }).catch((e)=>{
        return  res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate,(req, res)=> {
   var id = req.params.id;
   if(!Types.ObjectId.isValid(id)){
    return  res.status(404).send();
   }
   
   Todo.findOne({
        _id:id,
        _creator:req.user._id
   }).then((todo) => {
    if(!todo){
        return  res.status(404).send();
    }
    res.send(todo);
   }).catch((e)=>{
        return res.status(400).send();
   });

});

app.delete('/todos/:id',authenticate,(req, res)=>{
    var id = req.params.id;
    if(!Types.ObjectId.isValid(id)){
        return res.status(404).send();
    }
    
    Todo.findOneAndRemove({
        _id:id,
        _creator: req.user._id
    }).then((todo) => {
     if(!todo){
        return res.status(404).send();
     }
     res.send(todo);
    }).catch((e)=>{
        return res.status(400).send();
    });
});

app.patch('/todos/:id',authenticate,(req,res) =>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);
    if(!Types.ObjectId.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({
        _id:id,
        _creator:req.user._id
    },{$set: body}, {new:true}).then((todo)=>{
        if(!todo){
            res.status(404).send();
        }

        res.send(todo);
    }).catch((e)=>{

    });
});

app.post('/users',(req,res)=>{
    var body = _.pick(req.body, ['email','password']);
    var user = new User(body);
    user.save().then(()=>{
        
        return user.generateAuthToken();
        
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
        return res.status(400).send(e.message);
    })
});


app.get('/users/me',authenticate, (req,res)=>{
    res.send(req.user);
});

app.post('/users/login', (req,res)=>{
    var credentials = _.pick(req.body,['email', 'password'])
    User.login(credentials).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
    }).catch((e)=>{
         if(!e || !e.customErrorM){
             return res.status(400).send();
         }
        res.status(400).send(e.customErrorM);
    });
});

app.delete('/users/me/token', authenticate, (req,res) =>{
    req.user.removeToken(req.token).then(()=>{
        res.send();
    }).catch((e)=>{
        req.status(400).send();
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

