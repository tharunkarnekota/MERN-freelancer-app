//just for my reference, main file is server.js

const express = require('express');
const mongoose = require('mongoose');
const user = require('./usermodel')
const jwt = require('jsonwebtoken');

const app = express();

mongoose.connect('mongodb+srv://tharunkarnekota:tharunkarnekota@cluster0.w544y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(
    ()=> console.log('Db connected..')
)

app.use(express.json());

app.get('/', (req,res) =>{
    return res.send('Hello world');
})

app.post('/register',async (req,res) =>{
    try{
        const { fullname,email,mobile,skill,password,confirmpassword } = req.body;
        const exist = await user.findOne({email});
        if(exist){
            return res.status(400).send('user already registered')
        }
        if(password !== confirmpassword){
            return res.status(400).send('password invalid')
        }
        let newUser = new user({
            fullname,email,mobile,skill,password,confirmpassword
        })
        newUser.save();
        return res.status(200).send('User Registered')
    }
    catch(err){
        console.log(err)
        return res.status(500).send('register Server Error')
    }
})


app.post('/login',async (req,res)=>{
    try{
        const {email,password} = req.body;
        const exist = await user.findOne({email})
        if(!exist){
            return res.status(400).send('User not Exist')
        }
        if(exist.password !== password){
            return res.status(500).send('password invalid')
        }
        let payload = {
            user : {
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtPassword',{expiresIn:360000000},
        (err,token)=>{
            if(err) throw err
            return res.json({token})
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).send('login Server Error')
    }
})


app.listen(5000,()=> console.log('Server is Running..'))