//just for my reference, main file is server.js

const express = require('express');
const mongoose = require('mongoose');
const user = require('./usermodel')


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
        return res.status(500).send('Server Error')
    }
})



app.listen(5000,()=> console.log('Server is Running..'))