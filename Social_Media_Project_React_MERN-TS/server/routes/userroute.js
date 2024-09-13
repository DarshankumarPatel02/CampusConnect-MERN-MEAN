let express = require('express')
let userroute = express.Router()


let User = require('../model/usermodel')
let asynchandler = require('express-async-handler')
let generatetoken = require('../util/token')
let protect = require('../middleware/authmiddleware')
const userController = require('../controllers/userController');
let bcrypt = require('bcryptjs')
userroute.get('/',(req,res)=>{

  res.send('hello')

})
userroute.post('/login',asynchandler( async(req,res)=>{
  let {email, password} = req.body  
  let user = await User.findOne({email})
 
 
 
  if(user && (await user.matchpassword(password))){
    
   res.json({
    _id:user._id, 
    name:user.name,
    email:user.email,
    isAdmin:user.isAdmin,
    token: generatetoken(user._id)
  
  })
  
} 

else {
  
  res.status(401)
  throw new Error('wrong credential')
}

}))

// PUT /api/profile/:id
userroute.put('/profile/:id', userController.updateUserDetails);


userroute.get('/userDetails', protect, async (req, res) => {
  res.json({
    username: req.user.name,
    email: req.user.email,
    id: req.user._id
  });
});


userroute.post('/', asynchandler( async(req,res)=>{

    let { name, email ,password} = req.body  
    let exuser = await User.findOne({email})
    if(!exuser){
          let pwd = await bcrypt.hash(password, 10)
          let ruser = await User({
           name,
           email,
  
           password:pwd
          })
        await ruser.save()
  
        
        if(ruser){
         res.status(201).json({
          _id:ruser._id, 
        
        
        
        
          name:ruser.name,
        
          email:ruser.email,
          isAdmin:ruser.isAdmin,
          token: generatetoken(ruser._id)
         }) 
        }
        else {
          
          res.status(400)
          throw new Error('user can not be saved')
        } 
  
      } 
  else {
    throw new Error('user exists') 
  }      
  
  
  }))
  userroute.get('/username', protect, async (req, res) => {
    res.json({
      username: req.user.name
    });
  });  

  module.exports = userroute  