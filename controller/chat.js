const chatModel = require('../model/chat');
const mongoose = require('mongoose');
const avatarBaseUrl = require('../config')['avatarBaseUrl'];

chatController = {
    add: async (chat) => {
        const chatData = new chatModel(chat);
        await chatData.save();
    },
    getChatRoomData: (from, to) => new Promise((resolve, reject) => {
        chatModel.find({ from, to })
            .exec()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    }),
    getUserChatList: (userId) => new Promise((resolve, reject) => {
        chatModel.aggregate(
            [
                {
                    "$match":
                    {
                        "$or":
                            [
                                { "from": mongoose.Types.ObjectId(userId) },
                                { "to": mongoose.Types.ObjectId(userId) }
                            ]
                    }
                },
                { "$sort": { "createdAt": -1 } },
                {
                    "$group": {
                        "_id": "$from",
                        "to": { "$first": "$to" },
                        "message": { "$first": "$message" },
                        "date": { "$first": "$createdAt" },
                        "origId": { "$first": "$_id" },
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "from",
                        "foreignField": "_id",
                        "as": "from"
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "to",
                        "foreignField": "_id",
                        "as": "to"
                    }
                },
                { "$unwind": { "path": "$_id" } },
                { "$unwind": { "path": "$to" } },
                {
                    '$project': {
                        "_id": "$_id",
                        "from": {
                            "name": "$from.name",
                            "_id": "$from._id"
                        },
                        "to": {
                            "name": "$to.name",
                            "_id": "$to._id"
                        },
                        "message": "$message",
                        "messageId": "$origId",
                        "date": "$date",
                    }
                }
            ],
            function(err,results) {
                if (err) return reject(err);
                results.forEach((data, index) => {
                    if (data.to) {
                        results[index].to.avtar = `${avatarBaseUrl}${data.to.name}`;
                    }
                })
                return resolve(results);
            })

    }),
}

module.exports = chatController;