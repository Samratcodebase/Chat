const Login=(req , res)=>{
   
    res.status(200).json({
        message:"Login Route",
        sucess:true,
    })
 
}

export {Login}