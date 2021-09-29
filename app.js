const express = require("express");
const app =  express();
const port = process.env.port || 8080;
const mongoClient = require("mongodb").MongoClient;

//mildware
app.use(express.urlencoded({extended:true}));

//initilise handlebars view engine
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs());
app.set("view engine","handlebars");


//use public folder
const path = require("path");
app.use(express.static(path.join(__dirname,"public")));




//connect to database
const dbName = "employee"
const url = "mongodb://localhost:27017";

mongoClient.connect(url,(err,con)=>{
    if(err) console.log(err);
    else{
        let db = con.db(dbName);
   
        //ADD
app.post("/add",(req,res)=>{
    let empID = req.body.id;
    let name = req.body.name;
let mydoc = {name:name,id:empID}

//check userid already exist or not
db.collection("employeeDetails").find({id:empID}).toArray((err,result)=>{
    if(err) throw err
    else if(result.length>1){
      
res.render("success",{
    message:`This id is taken already, please enter new id.`
})
  
    }
    else{
        db.collection("employeeDetails").insertOne(mydoc,(err,result)=>{
            if(err)throw err
            else{
      
              res.render("success",{
                  addmessage:`Employee is added successfully with an id ${empID}`
              })
              
            }
        })
    }
})




})
//Read
app.post("/view",(req,res)=>{
let id = req.body.id;
db.collection("employeeDetails").find({id:id}).toArray((err,result)=>{
if(err) throw err;
else{
    if(result.length == 0){
        res.render("success",{
            message:`could not find any data..`
        })
    }else{
        res.render("success",{
            result    
            })
    }
   
}

})

})

//Delete
app.post("/delete",(req,res)=>{
let id = req.body.id;



db.collection("employeeDetails").deleteOne({id :id},(err,result)=>{
    if(err)throw err;
    else if(result.deletedCount ==0){
        res.render("success",{
            message:`Action could not complete because of invalid employee id`
        })
    }
    else{
    
        res.render("success",{
            delMessage:`Successfully deleted employee, having  an id ${id}`
        })
    }
})


})

//Update
app.post("/update",(req,res)=>{
    let id = req.body.id;
    let newName = req.body.name;


    db.collection("employeeDetails").updateOne({id:id},{$set:{name:newName,id:id}}, (err,result)=>{
        if(err)throw err
        else if(result.modifiedCount ==0){
            res.render("success",{
                message:`Action could not complete because of invalid employee id`
            })
        }
        else{
        console.log(result);
            res.render("success",{
                updatemessage:`Update successfull, new name is ${newName}`
            })
        }
    })
})






    }
})

//render homepage
app.get("/",(req,res)=>{
    res.render("home");
})




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})