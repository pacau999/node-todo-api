// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, client)=>{
    if(error){
        return console.log('Unable to connect to mongodbserver');
    }

    console.log('Connected do MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something todo',
    //     completed:false
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert Todo');
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Pacau',
    //     age:21,
    //     location: "Itajuba - MG, Brasil"
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert User');
    //     }

    //     console.log((result.ops[0]._id.getTimestamp()));
    // });
    client.close();
});