const Group = require('../database/models/Group');
const { Message, Like, MessageLikes } = require('../database/models/Message');
const User = require('../database/models/User');


const addMessage = async (req, res, next) => {
    const { message, user, group } = req.body;
    try {
        const messageGroup = await Group.findByPk(group);
        const sender = await User.findByPk(user);
        let newMessage = await Message.create({
            text: message,

        });

        const s1 = await sender.addMessage(newMessage);
        const s2 = await messageGroup.addMessage(newMessage);


        newMessage = await Message.findByPk(newMessage.id, { include: [User, Like] });

        res.status(200).json({
            status: "success",
            result: newMessage,
        });
    }
    catch (e) {
        console.log(e)
    }
}

const likeMessage = async (req, res, next) => {
    const { message, user } = req.body;
    const existMessage = await Message.findByPk(message);
    const sender = await User.findByPk(user);

    let newLike = await Like.create({
        user_id: user,
        message_id: message
    });
    await existMessage.addLike(newLike);
    await sender.addLike(newLike);
    newLike = await Like.findByPk(newLike.id, { include: [User] });
    res.status(200).json({
        status: "success",
        result: newLike,
    });
}

const disLikeMessage = async (req, res, next) => {
    const { id } = req.params;
    const like = await Like.findByPk(id);

    await like.destroy();

    res.status(200).json({
        status: "success",
        result: true,
    });
}



const getAllGroupMessages = async (req, res, next) => {
    const { id } = req.params;
    const result = await Group.findByPk(id, {
        include: [{ model: Message, include: [User, Like] }, User],
    })
    res.status(200).json({
        status: "success",
        result,
    });
}
module.exports = { addMessage, likeMessage, getAllGroupMessages, disLikeMessage }