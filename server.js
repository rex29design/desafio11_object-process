const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
require("dotenv").config()
const config = require("./config")
const randomRouter = require("./routes/randoms.route")
const info = require("./controllers/info")
const app = express()

const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const User = require("./model/user")

app.set("views", "./views")
app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, "public")))
app.use("/api/randoms", randomRouter)

//Con DOTENV:
const mongo_uri = process.env.MONGO_URI

mongoose.connect(mongo_uri, function(err){
    if (err) {
        throw err
    } else {
        console.log("Successfully connected to DB");
    }
})

app.post("/register", (req, res) => {
    const {username, password} = req.body
    const user = new User({username, password})
    user.save(err => {
        if(err){
            res.render("error")
        } else {
            res.render("user-registered")
        }
    })
})

app.post("/authenticate", (req, res) => {
    const {username, password} = req.body
    User.findOne({username}, (err, user) => {
        if(err){
            res.render("error")
        } else if(!user){
            res.render("error")
        } else {
            user.isCorrectPassword(password, (err, result) => {
                if (err){
                    res.render("error")
                } else if(result){
                    res.redirect("/user-login.html")
                } else {
                    res.render("error")
                }
            })
        }
    })
})

app.get("/info", (req, res) => {
    res.render("info", {info})
})

app.listen(config.PORT, () => {
    console.log(`App listening on ${config.PORT}`);
})