const express = require("express");
// const users = require("./MOCK_DATA.json");
const res = require("express/lib/response");
const fs = require("fs");
const { timeStamp } = require("console");
const UserRouter = require("./routes/user")
const { logResReq } = require("./middlewears")

const {connectMongodb} = require("./connections")

const app = express();

// connet Mongoose
connectMongodb("mongodb://127.0.0.1:27017/HimanhsuDB");

// schema
// --- upload in user.js
// model schema
// --- upload in user.js

//middlewear
app.use(express.urlencoded({ extended: false }));

// middleware
app.use((req, res, next) => {
    console.log("HEllo From Himanshu")
    next(); // next function to call next middleware
});

app.use(logResReq("log.txt"));

// routes
app.use("./user", UserRouter)


app.listen(8001, () => console.log(`server is started: ${8001}`));


