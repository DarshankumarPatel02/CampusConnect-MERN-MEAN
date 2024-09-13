let jwt = require('jsonwebtoken')
let User = require('../model/usermodel')


let expresshandler = require('express-async-handler')
let protect = expresshandler( async(req,res,next)=>{
  let token 
  // console.log(token)
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
  try {
    
    token = req.headers.authorization.split(' ')[1]
    
    let decoded = jwt.verify(token, 'hello127')
    // console.log(decoded)
    req.user = await User.findById(decoded.id).select('-password')
    



    next() 
  
  } catch (err) {
    console.log(err)
    res.status(401)
    throw new Error('not authorized') 
  }

}

  if(!token){    
    res.status(401)
    throw new Error('not authorized')
  
  


  }

})

module.exports = protect