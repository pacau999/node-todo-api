// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, client)=>{
    if(error){
        return console.log('Unable to connect to mongodbserver');
    }

    console.log('Connected do MongoDB server');
    const db = client.db('TodoApp');

    //deleteMany
    // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // });
    //deleteOne
    db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
        console.log(result);
    });
    
    //findOneAndDelete
    
  
    //client.close();
});