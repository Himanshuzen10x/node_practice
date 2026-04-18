const express = require("express");

const router = express.Router();
const { HandleGetAllUser, HandleGetUserByID, HandleUpdateUserByID, HandleDeleteUserByID, HandleNewUser } = require("../controllers/user");

router.route("/")
    .get(HandleGetAllUser)
    .post(HandleNewUser);

router.route("/:id")
    .get(HandleGetUserByID)
    .patch(HandleUpdateUserByID)
    .delete(HandleDeleteUserByID);


module.exports = router;