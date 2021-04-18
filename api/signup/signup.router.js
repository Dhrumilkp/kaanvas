const { createUser,gcreateUser,increateUser } = require("./signup.controller");
const router = require("express").Router();

router.post("/",createUser);
router.post("/guser",gcreateUser);
router.post('/inuser',increateUser);
module.exports = router;