const notifications = require('../model/notification');

notificationController = {
    add: async (notification) => {
        const notificationData = new notifications({ ...notification });
        await notificationData.save();
    },
    getAll: () => new Promise((resolve, reject) => {
        notifications.find({})
            .exec()
            .then((data) => {
                resolve({ data });
            })
            .catch((error) => {
                reject(error);
            })
    }),
    getAllNotificationByUserID: (userID) => new Promise((resolve, reject) => {
        notifications.find({ for: userID })
            .populate('for', 'name')
            .lean()
            .exec()
            .then((data) => {
                resolve({ data });
            })
            .catch((error) => {
                reject(error);
            })
    }),
    getUserNotificationWithCount: (userID,) => new Promise((resolve, reject) => {
        const limit = 10;
        notifications.find({ for: userID })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('for', 'name')
            .lean()
            .exec()
            .then(async (data) => {
                const count = await notifications.find({ for: userID, read: false }).count();
                resolve({ count, data });
            })
            .catch((error) => {
                reject(error);
            })
    }),
    getUserNotificationCount: (userID, type) => new Promise((resolve, reject) => {
        const read = type === 'read';
        notifications.find({ for: userID, read })
            .populate('for', 'name')
            .lean()
            .exec()
            .then((data) => {
                resolve({ count: data.length });
            })
            .catch((error) => {
                reject(error);
            })
    }),
    makrdVisited: (notificationID) => new Promise((resolve, reject) => {
        notifications.findOneAndUpdate({ _id: notificationID }, { visited: true, read: true })
            .populate('for', 'name')
            .lean()
            .exec()
            .then((data) => {
                resolve({ data });
            })
            .catch((error) => {
                reject(error);
            })
    }),
    markAllRead: (userID) => new Promise((resolve, reject) => {
        notifications.updateMany({ for: userID }, { read: true })
            .populate('for', 'name')
            .lean()
            .exec()
            .then((data) => {
                resolve({ data });
            })
            .catch((error) => {
                reject(error);
            })
    }),
    getbyId: (id) => new Promise((resolve, reject) => {
        notifications.findOne({ _id: id })
            .exec()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    }),
    delete: (id) => new Promise((resolve, reject) => {
        notifications.findOne({ _id: id })
            .lean()
            .exec()
            .then(async (notification) => {
                notification.isDeleted = true;
                await notifications.findOneAndUpdate({ _id: notification._id }, notification);
                resolve({ isSuccess: true, message: 'Notification deleted' });
            })
            .catch((error) => {
                reject(error);
            })
    })
};

module.exports = notificationController;
