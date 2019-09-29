var express = require("express");
var app = express();
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser:true,useUnifiedTopology:true})

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now()}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Himalaya",image:"https://unsplash.com/photos/Wnts0njP-n0",body:"Heaven onthe Earth should visit atleast once in life time"
// })

app.get('/',(req,res)=>{
    res.redirect('/blogs');
});

app.get('/blogs',(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log("error");
        }else[
            res.render("index",{blogs:blogs})
        ]
    })
})

//NEW ROUTE
app.get('/blogs/new',(req,res)=>{
    res.render('newBlog')
})

//CREATE ROUTE
app.post('/blogs',(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newblog)=>{
        if(err){
            res.render('/new')
            console.log("error aa gaya bhai");
        }else{
            res.redirect('/blogs')
        }
    })
})

//Show Detail
app.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            console.log("error occurred");
        }else{
            res.render("showBlog",{blog:foundBlog})

        }
    })
})
// Edit Blog
app.get('/blogs/:id/edit',(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            console.log("error occurred");
        }else{
            res.render("edit",{blog:foundBlog})

        }
    })
})
//Update Blog
app.put('/blogs/:id',(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updated)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
})
//Delete Blog
app.delete('/blogs/:id',(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs');
        }
    })
})


app.listen(3000,()=>{
    console.log("yeey connected")
})