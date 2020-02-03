var express = require("express"),
mongoose    = require("mongoose"),
bodyparser  = require("body-parser"),
methodOverride = require("method-override"),
expresSanitize = require("express-sanitizer"),
app         = express(),
port        = 3000;


app.use(methodOverride("_method"))
app.use(bodyparser.urlencoded({ extended : true }));
app.set("view engine" ,"ejs");
app.use(express.static("public"));
app.use(expresSanitize());


///mongoose connections 
mongoose.connect('mongodb://localhost:27017/blogpost', {useNewUrlParser: true});
//schema 
var schema = new  mongoose.Schema({
     title : String,
     image : String,
     body  : String,
     date  : {type : Date , default : Date.now}
 });

var blog = mongoose.model("blog",schema);

// ===========creating a post ==========
//  blog.create({
//      title : "dog the pet",
//      image : "https://i.pinimg.com/236x/ba/6a/2e/ba6a2ec798ac28e2648e5ba3cdb45439.jpg",
//      body  : "The domestic dog is a member of the genus Canis, which forms part of the wolf-like canids, and is the most widely abundant terrestrial carnivore."
//  },function(err , post){
//      if(err){
//          console.log(err);
//      }else{
//          console.log(post);
//      }
//  });


app.get("/",function (req,res) {
    blog.find({},function(err , post){
        if(err){
        
            console.log(err);
        }else{
           res.redirect("/blogs");
        }
    })
})
app.get("/blogs",function (req,res) {
    blog.find({},function(err , post){
        if(err){
        
            console.log(err);
        }else{
            res.render("index" , {post : post})
        }
    })
})

app.post("/blogs",function(req,res){

    req.body.body = req.sanitize(req.body.body);
    
    blog.create({
        title : req.body.title,
        image : req.body.image,
        body  : req.body.body
    },function(err , post){
        if(err){
            console.log(err);
        }else{
            res.redirect("blogs");
        }
    });
});


app.get("/blogs/new",function(req,res){
     res.render("new");
});

app.get("/blogs/:id",function(req,res){
     blog.findById(req.params.id , function(err , blog){
         if(err){
             console.log(err);
         }else{
            
             res.render("show",{blog : blog});
         }
     })
   
})

app.put("/blogs/:id",function(req,res){
     req.body.body = req.sanitize(req.body.body);
     var blogbody =   { 
        title : req.body.title,
        image : req.body.image,
        body  : req.body.body
        }

    blog.findByIdAndUpdate(req.params.id ,blogbody ,function(err, updatedblog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
    
});
app.delete("/blogs/:id",function(req,res){

    blog.findByIdAndRemove(req.params.id , function(err , delated){
          if(err){
              console.log(err);
          }else{
              console.log(delated);
              res.redirect("/blogs");
          }
    })
   
});

app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id , function(err ,foundblog){
        if(err){
            console.log(err);
        }else{
           
            res.render("edit",{blog : foundblog});

        }
    })
     

})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));