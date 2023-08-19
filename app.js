

const express= require('express');
const bodyParser= require('body-parser');
const mongoose = require("mongoose");
var _ = require('lodash');
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


async function connectToDB() {
  const password = encodeURIComponent('12@sourav');
  const dbName = 'blogDb';
  const clusterName = 'cluster0'; // Replace with your actual cluster name
  const uri = `mongodb+srv://blog-via-sourav:${password}@${clusterName}.qi42bbr.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

// Call the function to connect to the database
connectToDB().catch(error => console.error(error));

const homeStartingContent = "(Across the Globe internship) Hello folks Sourav Kumar this side ( This is simple Blog post social media project where you can write your daily blogs).";
const aboutContent = "I have used REST APIs and mongoDb to create this Blog Social Media Website.";
const contactContent = "You can check all my personal details in my portfolio website:-https://imsourav03.github.io/souravPortfolio/";

let posts=[];

app.get('/', (req,res)=>{
  res.render('home.ejs',{
    homeStartingContent: homeStartingContent,
    posts: posts
  });
});

app.get('/about', (req, res)=>{
  res.render('about.ejs',{
    aboutContent: aboutContent
  });
});

app.get('/contact',(req,res)=>{
  res.render('contact.ejs',{
    contactContent: contactContent
  });
});

app.get('/compose', (req, res)=>{
  res.render('compose.ejs');
})

app.post('/compose', (req,res)=>{
  const composeData={
  title: req.body["titleText"],
  content: req.body["postName"]
  }
  posts.push(composeData);
  res.redirect('/');
});

app.get('/posts/:postName', function(req,res){
  const testTitle = _.lowerCase(req.params.postName);
  posts.forEach(function(data){
    const storedTitle= _.lowerCase(data.title);
    if(storedTitle === testTitle){
      res.render('post.ejs',{
        title: data.title,
        content: data.content
      })
    }
  })
  
})
app.get('/posts/:postName', function(req, res) {
  const testTitle = _.lowerCase(req.params.postName);
  const post = posts.find((data) => _.lowerCase(data.title) === testTitle);

  if (post) {
    res.render('post.ejs', {
      title: post.title, // Ensure that title is set correctly
      content: post.content
    });
  } else {
    // Handle the case where the post is not found
    res.status(404).send('Post not found');
  }
});




// Delete a specific blog post
app.post('/delete', (req, res) => {
  const postTitleToDelete = req.body.postTitle;

  console.log('Post Title to Delete:', postTitleToDelete);

  // Use lodash to find the index of the post to delete based on title
  const indexToDelete = _.findIndex(posts, (post) => _.lowerCase(post.title) === _.lowerCase(postTitleToDelete));

  console.log('Index to Delete:', indexToDelete);

  if (indexToDelete !== -1) {
    posts.splice(indexToDelete, 1); // Remove the post at the found index
    res.redirect('/');
  } else {
    res.status(404).send('Post not found'); // Handle the case where the post is not found
  }
});



// Update a specific blog post
app.get('/update/:postName', (req, res) => {
  const postNameToUpdate = _.lowerCase(req.params.postName);

  // Find the post in the posts array based on the post name
  const postToUpdate = _.find(posts, (post) => _.lowerCase(post.title) === postNameToUpdate);

  res.render('update.ejs', { postToUpdate });
});

app.post('/update/:postName', (req, res) => {
  const postNameToUpdate = _.lowerCase(req.params.postName);

  // Find the post in the posts array based on the post name
  const postToUpdate = _.find(posts, (post) => _.lowerCase(post.title) === postNameToUpdate);

  // Update the content of the post
  postToUpdate.content = req.body.updatedContent;

  res.redirect('/');
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
