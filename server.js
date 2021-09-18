const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv').config()
const path = require('path')
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require('express');
const User = require("./user");
// const { RSA_NO_PADDING } = require('constants')

const app = express()

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Database connected');
})

/******************** MIDDLEWARE ********************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ encoded: true, extended: true }))
app.use(cors({
    origin: "https://plus-ultra-d6.herokuapp.com",
    credentials: true
}))
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}))
// passport.use(User.createStrategy())
app.use(cookieParser(process.env.SECRET))
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)
/******************** MIDDLEWARE ********************/










/******************** TEST-ROUTE ********************/
app.get("/helloServer", (req, res) => {
    res.json({
        message: "Hello from server!"
    })
    // res.redirect("/")
})
/******************** TEST-ROUTE ********************/





/******************** ROOT-ROUTE ********************/
app.get("/", (req, res) => {
    res.send("At homepage now!");
})
/******************** ROOT-ROUTE ********************/





/******************** HOME-ROUTE ********************/
app.get("/home", (req, res) => {
    res.send("<h1>Home</h1>");
    // res.render("<h1>Home</h1>")
})
/******************** HOME-ROUTE ********************/





/******************** STUDENTS-ROUTE ********************/
app.get("/students", (req, res) => {
    res.send("At students page now!");
})
/******************** STUDENTS-ROUTE ********************/





/******************** LOGIN-ROUTE ********************/
app.post("/login", async (req, res, next) => {
    
    await passport.authenticate("local", (err, user, info) => {
        if(err) throw(err)
        if(!user) res.send("No user found")
        if(user) {
            req.login(user, (error) => {
                if(error) throw(error)
                res.send('Logged in successfully!')
                console.log("USER: ", user)
            })
        }
    })(req, res, next)
})

app.get("/logout", (req, res) => {
    // req.logout()
    // res.redirect("/students")
    res.send("Logged out!")
})
/******************** LOGIN-ROUTE ********************/




// {$or: [{email: req.body.email}, {username: req.body.username}]}
/******************** SIGNUP-ROUTE ********************/
app.post("/signup", (req, res) => {
    User.findOne( {$or: [{email: req.body.email}, {username: req.body.username}]}, async(err,doc) => {
        if(err) throw(err);
        if(doc) res.send("User exists")

        if(!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword
            });
            await newUser.save();
            res.send("New User registered")
        }
    });
});
/******************** SIGNUP-ROUTE ********************/





/******************** EDIT-PROFILE-ROUTE ********************/
app.get("/editprofile", (req, res) => {
    res.send("At editprofile page now!");
})
/******************** EDIT-PROFILE-ROUTE ********************/





/******************** TEST-ROUTE ********************/
app.post("/send", (req, res) => {
    res.send(req.body)
})
/******************** TEST-ROUTE ********************/






/******************** TEST-ROUTE ********************/
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
//     // res.render("<h1>Go back!</h1>")
// });
/******************** TEST-ROUTE ********************/










if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"))
}

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
})