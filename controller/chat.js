const chatModel = require('../model/chat');

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
        debugger
        chatModel.aggregate(
            [
                {
                    $match:
                    {
                        $or:
                            [
                                { from: userId },
                                { to: userId }
                            ]
                    }
                },
                { $sort: { createdAt: -1 } },
                {
                    $group: {
                        _id: $from,
                        to: { $first: $to },
                        message: { $first: $message },
                        date: { $first: $date },
                        origId: { $first: $_id },
                    }
                },
                {
                    $lookup: {
                        from: users,
                        localField: from,
                        foreignField: _id,
                        as: from
                    }
                },
                {
                    $lookup: {
                        from: users,
                        localField: to,
                        foreignField: _id,
                        as: to
                    }
                },
                { $unwind: { path: $_id } },
                { $unwind: { path: $to } }
            ],
            function(err,results) {
                debugger
                if (err) return reject(err);
                return resolve(results);
            })

    }),
}

module.exports = chatController;