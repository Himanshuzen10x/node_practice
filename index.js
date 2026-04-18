const express = require("express");
// const users = require("./MOCK_DATA.json");
const res = require("express/lib/response");
const fs = require("fs");
const mongoose = require("mongoose");
const { timeStamp } = require("console");

const app = express();

// connet Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/HimanhsuDB")
.then(() => console.log("mongoose connected")).catch((err) => console.log("mongo error", err));
// schema
const userSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    JobTitle: {
        type: String,

    },
    Gender: {
        type: String,
        required: true,
    }
},
{timestamps: true});

// model schema
const User =  mongoose.model("user", userSchema);

//middlewear
app.use(express.urlencoded({ extended: false }));

// middleware
app.use((req, res, next) => {
    console.log("HEllo From Himanshu")
    next(); // next function to call next middleware
});

app.use((req, res, next) => {
    fs.appendFile("log.txt", `\n${Date.now()}: ${req.ip} ${req.method}: ${req.path}`, (err, data) => {
        next();
    });
});

app.get("/api/users", async (req, res) => {
    const allUserDBS = await User.find({})
    console.log(req.headers);
    return res.json(allUserDBS);
    // res.setHeader("X-myName", "Hiamnshu Khare"); //custum headers 
    // use X- in Custum headers naming
    //there are may buildin headers also
});

app.get("/users", async (req, res) => {

    const allUserDBS = await User.find({})
    const html = `
    <ul>
    ${allUserDBS.map(user => `<li>${user.FirstName} - ${user.Email}</li>`).join("")}
    </ul>
    `
    res.send(html);
})
// dynamic ids

app.route("/api/users/:id").
get( async (req, res) => {
    const allUserDBS = await User.find({})
    const user = await User.findById(req.params.id);
    //https status codes
    //     200 OK
    // 201 Created
    // 400 Bad Request
    // 404 Not Found
    // 500 Internal Server Error
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    return res.json(user);
})
    .patch( async (req, res) => {
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                FirstName: req.body.first_name,
                LastName: req.body.last_name,
                Email: req.body.email,
                Gender: req.body.gender,
                JobTitle: req.body.job_title,
            },
            { new: true, runValidators: true }); 

            if(!user){
                return res.status(404).json({ message: "User not Found"})
            }
            
            return res.status(200).json({
                message: "User updated successfully"
            });
        }
        catch (error) {
            console.log("ERROR:", error);  
            return res.status(500).json({ message: error.message });
        }
        // if (user === -1) {
        //     return res.status(404).json({ message: " user not found" });
        // }
    });

    // .delete( async (req, res) => {
    // await User.findByIdAndDelete(req.params.id)
    // return res.json({ message: "Deleted",})
    //     //delete code

    // });



app.post("/api/users", async (req, res) => {
    const body = req.body;
    if (!body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        //https status codes
        return res.status(404).json({ message: "all Fields are required to be filled" });
    }

    const result = await User.create({
        FirstName: body.first_name,
        last_name: body.last_name,
        Email: body.email,
        Gender: body.gender,
        JobTitle: body.job_title,
    
    });
    console.log("result" , result);
    return res.status(201).json({ message: "Success"})

});



app.listen(8001, () => console.log(`server is started: ${8001}`));


