const chatModel = require('../model/chat');
const mongoose = require('mongoose');
const avatarBaseUrl = require('../config')['avatarBaseUrl'];

chatController = {
    add: async (chat) => {
        const chatData = new chatModel(chat);
        await chatData.save();
    },
    getChatRoomData: (from, to) => new Promise((resolve, reject) => {
        chatModel.find({ from: { $in: [from, to] }, to: { $in: [to, from] } })
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
                { "$sort": { "_id": -1 } },
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
                { "$unwind": { "path": "$from" } },
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
                        "messageId": "$_id",
                        "date": "$createdAt",
                    }
                }
            ],
            function (err, results) {
                if (err) return reject(err);
                const users = {};
                results.forEach((data) => {
                    if (data.to._id.toString() === userId) {
                        const isExists = Object.keys(users).includes(data.from._id.toString());
                        if (!isExists) {
                            users[data.from._id] = {
                                displayName: data.from.name,
                                userId: data.from._id,
                                avtar: `${avatarBaseUrl}${data.from.name}`,
                                message: data.message,
                                createdAt: data.createdAt
                            };
                        }
                    }
                    if (data.from._id.toString() === userId) {
                        const isExists = Object.keys(users).includes(data.to._id.toString());
                        if (!isExists) {
                            users[data.to._id] = {
                                displayName: data.to.name,
                                userId: data.to._id,
                                avtar: `${avatarBaseUrl}${data.to.name}`,
                                message: data.message,
                                date: data.date
                            };
                        }
                    }

                })
                return resolve(Object.keys(users).map((key) => users[key]));
            })

    }),
}

module.exports = chatController;