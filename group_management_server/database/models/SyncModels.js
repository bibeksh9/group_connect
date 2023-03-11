const Group = require('./Group');
const User = require('./User');
const { Message, Like } = require('./Message');
const GroupMember = require('./GroupMember');




const syncModels = async () => {
    try {
        await Group.sync();
        await User.sync();
        await Message.sync();
        await Like.sync();
        await GroupMember.sync();


        console.log('Models synced successfully');
        return true;
    } catch (error) {
        console.error('Error syncing models:', error);
    }
}

module.exports = syncModels;