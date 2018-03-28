const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    
    email:{
        required: true,
        minlength:1,
        type:String,
        trim: true,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }

    },
    password:{
        required: true,
        type: String,
        minlength: 6


    },
    tokens: [{
        access: {
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
 
});

//Muda o objeto retornado pela busca no banco de dados quando não se especifica parametros
//Ex: ao buscar um usuario e retornar o resultado da busca usando apenas o parametro user, é possivel filtrar o que é retornado para que não se retorne detalhes sensiveis do objeto 

UserSchema.methods.toJSON = function(){
    var user=this;
    var userObject = user.toObject();


    return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken = function (){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(()=>{
        return token;
    });
}

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token,'abc123');
    } catch(e){
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'

    });
};

UserSchema.statics.login = function(credentials){
    var User = this;
    if(!validator.isEmail(credentials.email) || !typeof(credentials.password)==="string" || credentials.password.length<6){
        return Promise.reject({"customErrorM":"Invalid Credentials"});
    }
    return User.findOne({'email':credentials.email}).then((user)=>{
        if(!user){
            return Promise.reject({"customErrorM":"Email not on DB"}); 
        }
        
        return bcrypt.compare(credentials.password,user.password).then((check)=>{
            if(!check){
                return Promise.reject({"customErrorM":"Bad Combination"}); 
            }
            return user;
            
        });
        
        
    });
    
}

UserSchema.pre('save', function(next){
    var user = this; 
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err, salt)=>{
            if(err){

            }
            bcrypt.hash(user.password,salt).then((hashedpass)=>{
                user.password=hashedpass;
                next();
            }).catch((e)=>{});
        });
    }else {
        next();
    }

});

var User = mongoose.model('User',UserSchema);


 module.exports={
     User
 }