const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express(); //bascially using a variable instead of typing express().whatever every single time.

app.set("views", path.join(__dirname, "views")); //first parameter is telling ejs what we want it to grab from (views in this case is a reserved keyword), second paramaeter is its location ('views' in this case refers to the folder itself, NOT the keyword)
app.set("view engine", "ejs"); //tells app thgat we want to use a template engine to process view files. Second option is what engine youre using

app.use(express.static("public")); // basically middleware that lets us use static files too. Whenever it gets a request, it checks if the file is in the public folder. If it is, the file is then returned as a response. If not, it will forward to the other routes (/restaurants etc), and if not the request will fail
app.use(express.urlencoded({ extended: false }));

// app.get("/", function (req, res) {
//remember, when it gets the '/' (ie visiting the base webasite) it executes the second thing in the parameter, in this case the function
//   res.send("<h1>Hello World!</h1>");
// }); -- BASELINE CODE EXAMPPLE
app.get("/", function (req, res) {
  //   const htmlFilePath = path.join(__dirname, "views", "index.html");
  //   res.sendFile(htmlFilePath);
  res.render("index");
});

app.get("/restaurants", function (req, res) {
  //   const htmlFilePath = path.join(__dirname, "views", "restaurants.html"); //we are basically creating a path to the file here, using __dirname which gets the location of our project, then going into views, and then grabbing restaurants.html
  //   res.sendFile(htmlFilePath);

  // THE ABOVE is a way of doing it without a template engine.

  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  }); //renders a template (one of our ejs files in this case) IE parse a template file with help of a template engine (like ejs), then convert it to HTML which then is sent back to the browser. Remember, it is able to access things because we set "views" and the appropriate file path earlier in line 7. We don't need to type restaurants.ejs becuase it's already looking for ejs, so restaurants works.
  // INSIDE OF the second parameter there, it is to hold any placeholder data that needs to be changed dynamically later as keys
  //   THE THIRD PARAMETER is grabbing the storedRestaurant objects from the JSON file and rendering them
});

app.get("/about", function (req, res) {
  //   const htmlFilePath = path.join(__dirname, "views", "about.html");
  //   res.sendFile(htmlFilePath);
  res.render("about");
});

app.get("/confirm", function (req, res) {
  //   const htmlFilePath = path.join(__dirname, "views", "confirm.html");
  //   res.sendFile(htmlFilePath);
  res.render("confirm");
});

app.get("/recommend", function (req, res) {
  //   const htmlFilePath = path.join(__dirname, "views", "recommend.html");
  //   res.sendFile(htmlFilePath);
  res.render("recommend");
});

app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData); // takes the shit from fileData and converts it from text into useable javascrip object

  storedRestaurants.push(restaurant);

  fs.writeFileSync(filePath, JSON.stringify(storedRestaurants)); //converts it back into text

  res.redirect("/confirm");
});

app.listen(3000); // sets up server that listens to requestss
