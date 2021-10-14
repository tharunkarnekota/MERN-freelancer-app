//just for my reference, main file is server.js

const express = require('express');

const app = express();

app.get('/', (req,res) =>{
    return res.send('Hello world');
})

app.listen(5000,()=> console.log('Server is Running..'))