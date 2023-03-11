const express = require('express');
const router = express.Router();

const { createUser, editUser, deleteUser, viewUser } = require('../controllers/admin_controller');




router.post("/createUser", createUser);
router.get("/viewUser", viewUser);
router.patch("/editUser", editUser);
router.delete("/deleteUser/:id", deleteUser);
module.exports = router;