const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const LogInCollection = require("./mongodb");

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up Handlebars views
const templatesPath = path.join(__dirname, "../tampelates");
app.set("view engine", "hbs");
app.set("views", templatesPath);

app.get("/",(req,res)=>{
    res.render("login-signup-option-page");    
})

// Home Route - Show Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

// Signup Page Route
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Handle Signup Form Submission
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        // Check if user already exists
        const existingUser = await LogInCollection.findOne({ name: req.body.name });

        if (existingUser) {
            res.send("User already exists. Please log in.");
        } else {
            await LogInCollection.insertMany([data]);
            res.status(201).render("home", { naming: req.body.name });
        }
    } catch (error) {
        res.send("Error occurred while signing up.");
    }
});

// Handle Login
app.post("/login", async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: req.body.name });
        } else {
            res.send("Incorrect username or password.");
        }
    } catch (e) {
        res.send("Login failed. Please try again.");
    }
});

// Home Page Route (After Successful Login)
app.get("/home", (req, res) => {
    res.render("home");
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
