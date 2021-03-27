const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

require("./passportConfigGoogle")

const initializePassport = require("./passportConfig");

initializePassport(passport);

const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// Lines 24 - 43 specific to Google OAuth20
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieSession({
    name: 'op_sec_login-session',
    keys: ['key1', 'key2']
  }));

const isLoggedIn = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(session({
    secret: "secret",

    resave: false,

    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// home
app.get("/", (req, res) => {
    res.render("index");
});

//register
app.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register");
});

// Login
app.get("/users/login", checkAuthenticated, (req, res) => {
    res.render("login");
});

// Dashboard
app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
    res.render("dashboard", { user: req.user.name });
});

// Logout
app.get("/users/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You have logged out");
    res.redirect("/users/login");
});

// GOOGLE AUTHENTICATION LINE 84 - 103
app.get("/here", (req, res) => res.send("You Are Not Logged In!"));
app.get("/failed", (req, res) => res.send("You Have Failed to Login"));
app.get("/good", isLoggedIn, (req, res) => res.send(`Welcome, ${req.user.displayName}!`));

app.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });

  app.get("/google/logout", (req, res) => {
      req.session = null;
      req.logout();
      res.redirect("/here");
  });

// Register for an account
app.post("/register", async (req, res) => {
    let { name, email, password, password2 } = req.body;

    // logs to the terminal
    console.log({
        name,
        email,
        password,
        password2
    })
    let errors = [];

    if(!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }

    if(password.length < 6 ) {
        errors.push({ message: "Password should be at least 6 characters" })
    }

    if(password != password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if(errors.length > 0) {
        res.render('register', { errors });
    } else {

        // use bcrypt to has the password 10 times. Despite two passwords being the exact same, their hashes may be different
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // Check if email is free to use
        pool.query(
            "SELECT * FROM users WHERE email = $1", 
            [email], 
            (err, results) => {
                if(err) {
                    throw err;
                }

                console.log(results.rows);

                if(results.rows.length > 0) {
                    errors.push({ message: "Email already registered"});
                    res.render("register", { errors })
                } else {
                    // register new user
                    pool.query(
                        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password", 
                        [name, email, hashedPassword], 
                        (err, results) => {
                            if(err) {
                                throw err;
                            }
                            
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please log in");
                            res.redirect("/users/login");
                        }
                    )
                }
            }
        )

    }
});

// Check to see if the user is logged in while they are on the login page. If they are, send them to the dashboard
app.post("/login", passport.authenticate("local", {
        successRedirect: "/users/dashboard",
        failRedirect: "/users/login",
        failureFlash: true
    })
);

// if a user is authenticated, then send to the dashboard
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return res.redirect("/users/dashboard");
    }
    next();
}

// check if a user is NOT authenticated, then send to login
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
       return next();
    }

    res.redirect("/users/login");
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});