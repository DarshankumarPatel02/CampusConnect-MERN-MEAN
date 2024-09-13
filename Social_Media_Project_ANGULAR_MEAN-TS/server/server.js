let express = require('express')
let mongoose = require('mongoose')

let app = express()

// let productroute = require('./route/productroute')
let cors = require('cors')
const userroute = require('./routes/userroute')
const postroute = require('./routes/postroute');
const contactroute= require('./routes/contactroute');
let {errorhandler} = require('./middleware/errormiddleware')
app.use(cors())


mongoose.connect('mongodb+srv://Darshan:indiecoders@cluster0.2nlejwd.mongodb.net/regplatform?retryWrites=true&w=majority').then(()=>{
    console.log('mongo connected')    
    }).catch((err)=>{
    console.log(err)         
    process.exit(1)

 })
 app.use(express.json()) 
// Register routes
app.use('/api/user', userroute)
app.use('/api/posts', postroute);
app.use('/api/contact', contactroute);
 app.use(errorhandler)
app.get('/',(req,res)=>{
     res.send('hello')
})

app.listen(3200,console.log('server on'))