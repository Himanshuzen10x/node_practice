const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
    const allUserDBS = await User.find({})
    console.log(req.headers);
    return res.json(allUserDBS);
    // res.setHeader("X-myName", "Hiamnshu Khare"); //custum headers 
    // use X- in Custum headers naming
    //there are may buildin headers also
});

// router.get("/users", async (req, res) => {

//     const allUserDBS = await User.find({})
//     const html = `
//     <ul>
//     ${allUserDBS.map(user => `<li>${user.FirstName} - ${user.Email}</li>`).join("")}
//     </ul>
//     `
//     res.send(html);
// })
// dynamic ids

router.route(":id").
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
    })
    .delete( async (req, res) => {
        try{
const user = await User.findByIdAndDelete(req.params.id)
if(!user){
    return res.sendStatus(404).json({ message: "user not found"})
}
return res.json({
    message: "User deleted successfully"
});
        } catch(error){
            console.log("ERROR" , error)
            return res.status(500).json({ message: error.message });
        }
    });



    router.post("/", async (req, res) => {
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

module.exports = router;