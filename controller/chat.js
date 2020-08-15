const chatModel = require('../model/chat');

chatController = {
    add: async (chat) => {
        const chatData = new chatModel(chat);
        await chatData.save();
    },
    getChatRoomData: (from, to) => new Promise((resolve, reject) => {
        chatModel.find({from, to})
        .exec()
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

module.exports = chatController;