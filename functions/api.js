const express = require("express")
const serverless = require("serverless-http")
var cors = require('cors')
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoURI = process.env.MURI

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
    }
    connectToMongo();
const UserSchema = new Schema({
   
   
    email:{
        type: String,
        required: true, 
    },
    password:{
        type: String,
        required: true, 
    },
    date:{
        type: Date,
        default: Date.now
    },
  });
const User = mongoose.models?.User || mongoose.model("User", UserSchema);
const api = express();
api.use(cors())
const router = express.Router();
router.post("/createUser", async(req, res) => {
  
    try{  
        const dat = req.apiGateway.event.body;
        const data = JSON.parse(dat)
        const email = data.email;
        const password = data.password;
           const user = new User({
                    email, password
                        })
        const sav = await user.save()

        res.status(200).json({"email":sav.email})

} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
});

router.get("/hello", async(req, res) => {
      res.json({"hello":"netlify"})

})
api.use("/.netlify/functions/api/", router);

module.exports.handler = serverless(api);