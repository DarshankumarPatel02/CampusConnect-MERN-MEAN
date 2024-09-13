let jwt = require('jsonwebtoken')
let generatetoken = (id)=>{


     return jwt.sign({ id}, 'hello127', {
         expiresIn: '1h'
     })    
}

module.exports = generatetoken