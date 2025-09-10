const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

const userSchema= new mongoose.Schema({
    username:{type:String, required:true},
    email:String,
    number:{type:String, required:true,min:10,max:10},
    message:{type:String, required:true},
});


const User= mongoose.model("User", userSchema);

app.post("/users", async(req,res)=>{
   try{
     const user = await User.create(req.body);
     res.json(user);
   }
    catch(err){
        res.status(500).json({error: err.message}); 
    }

})

app.get("/users", async(req,res)=>{
    try{
      const users= await User.find();
        res.json(users);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }})

app.delete("/users/:id", async(req,res)=>{
    try{
        const user= await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        res.json({message: "User deleted successfully"});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})
app.put("/users/:id", async(req,res)=>{
    try{
        const user= await User.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(!user){
            return res.status(404).json({error: "User not found"});
        }   
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = app;
