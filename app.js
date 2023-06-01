//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB')

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema)

////////////////////////////////Request Targeting All Articles///////////////////////////////

app.route('/articles')

.get(function(req, res) {
    Article.find()
    .then(function (foundArticles) {
      res.send(foundArticles);
    })
    .catch(function (err) {
      console.log(err);
    });
}) //tidak dikasih ; karna bukan akhir

.post(function(req, res) {
    console.log() 
    console.log() 

    const newArticles = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticles.save().then(()=>{
        res.send("success added");
    }).catch((err)=>{
        res.send(err);
    })
}) //tidak dikasih ; karna bukan akhir

.delete(function(req, res) {
    Article.deleteMany()
    .then(()=>{
        res.send("success deleted");
    }).catch((err)=>{
        res.send(err);
    })
}); //diberi ; karna akhir dari sebuah root route

////////////////////////////////Request Targeting A Specific Articles///////////////////////////////

app.route('/articles/:articleTitle')

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle})
    .then(function (foundArticles) {
        res.send(foundArticles);
      })
    .catch(function (err) {
        console.log(err);
      });
})

// .put(function(req, res){
//     Article.replaceOne(
//         {title: req.params.articleTitle},
//         {title: req.body.title, content: req.body.content},
//         {overwrite: true},
//         .then(()=>{
//             res.send("success deleted");
//         })
//       )
// })

.put(async(req, res) => {

    await Article.findOneAndUpdate(
  
      {title:req.params.articleTitle},                   
  
      {title:req.body.title, content:req.body.content},   
  
      {overwrite: true}
  
    ).then(foundArticles  =>{
  
      res.send("Successfully updated article.")
  
    }).catch(err => {
  
      console.log(err)
  
    });
  
})

.patch(function(req,res){

    Article.updateOne(
  
      {title: req.params.articleTitle},
  
      {$set: req.body}
  
    ).then (function(){
  
      res.send("Successfully updated article");
  
    }).catch (function(err){
  
      res.send(err);
  
    });
  
  })

.delete(function(req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle}
    )
    .then(()=>{
        res.send("success deleted ONE");
    }).catch((err)=>{
        res.send(err);
    })
}); 


    

app.listen(3000, function() {
  console.log("Server started on port 3000");
});