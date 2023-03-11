const express = require('express');
const router = express.Router();

const { addGroupMember, removeGroupMember, createGroup, deleteGroup, searchGroupMember, getUserGroups } = require('../controllers/group_controller');

const { addMessage, getAllGroupMessages, likeMessage, disLikeMessage, } = require('../controllers/messages_controller');

const { protect, restrictTo } = require('../controllers/auth_controller');



router.post("/createGroup", createGroup);
router.delete("/deleteGroup/:id", deleteGroup);
router.post("/addGroupMember", addGroupMember);
router.delete("/removeGroupMember/:user/:group", removeGroupMember);
router.post("/getUserGroups", getUserGroups);
router.post("/addMessage", addMessage);
router.get("/getMessages/:id", getAllGroupMessages);
router.post("/likeMessage", likeMessage);
router.delete("/dislikeMessage/:id", disLikeMessage);
router.get("/searchAllMembers/:text", searchGroupMember);



module.exports = router;