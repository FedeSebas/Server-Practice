const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")
const client = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const app = express();

client.setConfig({
  apiKey: process.env.API_KEY,
  server: "us12"
});

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/failure",function(req,res){
  res.redirect("/")
})

app.post("/success",function(req,res){
  res.redirect("/")
})

app.post("/",function(req,res){


  var member =
      {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
          FNMAE: req.body.firstName,
          LNAME: req.body.lastName
        }
      }


  


  const run = async () => {
    const response = await client.lists.batchListMembers(process.env.ID_LIST, {
      members: [member],
      update_existing: false
    });
    console.log(response);
    if (response.errors.length) throw new Error(response.errors);
    else res.sendFile(__dirname + "/success.html")
  };
run().catch(errors => res.sendFile(__dirname + "/failure.html"));


})


app.listen(process.env.PORT,function (){
  console.log(`server is running in ${process.env.PORT} port`);
})





