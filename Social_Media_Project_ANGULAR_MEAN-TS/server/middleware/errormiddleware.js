let notfound = (req,res,next)=>{
    let error = new Error(`not found -${req.originalUrl}`)
   
   
    res.status(404)
    next(error) 
  }
let errorhandler = (err, req, res, next)=>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
  
    res.json({
  
        message: err.message
    })  
  }




module.exports =  {errorhandler, notfound}