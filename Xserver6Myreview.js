//just for my reference, main file is server.js

const express = require('express');
const mongoose = require('mongoose');
const users = require('./usermodel')
const jwt = require('jsonwebtoken');
const middleware = require('./middleware')
const reviewmodel = require('./reviewmodel')

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
        const exist = await users.findOne({email});
        if(exist){
            return res.status(400).send('user already registered')
        }
        if(password !== confirmpassword){
            return res.status(400).send('password invalid')
        }
        let newUser = new users({
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
        const exist = await users.findOne({email})
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

app.get('/allprofiles',middleware,async (req,res) =>{
    try{
        let allprofiles = await users.find();
        return res.json(allprofiles);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('allprofiles Server Error')
    }
})

app.get('/myprofile',middleware, async (req,res)=>{
    try{
        let myprofile = await users.findById(req.user.id);
        return res.json(myprofile);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('myprofile Server Error')
    }
})

app.post('/addreview',middleware,async (req,res)=>{
    try{
        const {taskworker,rating} = req.body;
        const exist = await users.findById(req.user.id)
        const newReview = new reviewmodel({
            taskprovider : exist.fullname,
            taskworker,
            rating
        })
        newReview.save();
        return res.status(200).send('Review updated successfully')
    }
    catch(err){
        console.log(err);
        return res.status(500).send('addreview Server Error')
    }
})

app.get('/myreview',middleware,async (req,res)=>{
    try{
        let allreviews = await reviewmodel.find();
        let myreviews = allreviews.filter(review => review.taskworker.toString() === req.user.id.toString());
        return res.status(200).json(myreviews)
    }
    catch(err){
        console.log(err);
        return res.status(500).send('myreview Server Error')
    }
})
app.listen(5000,()=> console.log('Server is Running..'))