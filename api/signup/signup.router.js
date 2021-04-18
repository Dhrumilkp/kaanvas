const { createUser } = require("./signup.controller");
const router = require("express").Router();

router.post("/",createUser);

module.exports = router;