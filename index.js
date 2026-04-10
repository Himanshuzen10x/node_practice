const express = require("express");
const users = require("./MOCK_DATA.json");
const res = require("express/lib/response");
const fs = require("fs");

const app = express();

//middlewear
app.use(express.urlencoded({ extended: false}));

// middleware
app.use((req, res, next) => {
    console.log("HEllo From Himanshu")
    next(); // next function to call next muddleware
});

app.use((req,res,next)=> {
    fs.appendFile("log.txt" , `\n${Date.now()}: ${req.ip} ${req.method}: ${req.path}`, (err,data)=>{
        next();
    });
});

app.get("/api/users", (req, res) => {
    res.setHeader("X-myName" , "Hiamnshu Khare"); //custum headers 
    // use X- in Custum headers naming
    //there are may buildin headers also
    console.log(req.headers);
    return res.json(users);
});

app.get("/users", (req,res)=>{
    const html =  `
    <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html);
})
// dynamic ids

app.route("/api/users/:id").get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id == id);
    return res.json(user);
}) 
.patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.query;
    const user = users.findIndex((user) => user.id == id);
    if(user ===-1){
        return res.status(404).json({ message: " user not found"});        
    }
    users[user] = {...users[user], ...body};
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "File write error" });
        }

        return res.json({
            message: "User updated",
            updatedUser: users[user]
        });
    });
})

.delete((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id == id);
    if(userIndex == -1){
        return res.status(404).json({messgae: "user not found"})
    }
    //delete code
    users.splice(userIndex, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null,2), (err) =>{
        if(err){
            return res.json({ status: "FILE ERROR"});
        }
        return res.json({
            message: "User Deleted"
        });
    });

});



app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({ ...body , id: users.length +1});
    fs.writeFile("./MOCK_DATA.json" , JSON.stringify(users), (err, data) => {
        return res.json({ status: "success" , id: users.length})
    });

});



app.listen(8001, () => console.log(`server is started: ${8001}`));


