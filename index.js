const express = require("express")
const cors = require("cors");
const mongoose =  require("mongoose");

const PORT = 1232;
const app = express();
app.use(express.json())
app.use(express.urlencoded());
app.use(cors())
const url = "mongodb+srv://Admin:<password>@cluster0.zedayax.mongodb.net/form?retryWrites=true&w=majority";

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    cpassword:String
})
const User = mongoose.model("User",UserSchema)
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connnected to database");
}).catch(()=>{
    console.log("Not yet connected to database");
})

app.get("/",(req,resp)=>{
    resp.send("hello")
})

app.post("/login",(req,resp)=>{
    console.log(req.body)
    const {email,password} = req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
            if(password == user.password){
                resp.send({message:"login successful", data:req.body});
            }else{
                resp.send({message:"password doesn't Match"})
            }
        }else{
            resp.send({message:"user not registered"});
        }
    })
})

app.post("/register",(req,resp)=>{
  console.log(req.body)
  const {name,email,password,cpassword} = req.body;
    User.findOne({email:email}, (err,useR)=>{
        console.log(useR)
        if(useR){
            resp.send({message:"user already register"})
        }else{
            const NewUser = new User({
                name,
                email,
                password,
                cpassword
              })
              NewUser.save((err)=>{
                if(err){
                    resp.send(err);
                }else{
                    resp.send({message:"successfully register",data:{name,email,password,cpassword}});
                }
              })
        }
})
})

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})