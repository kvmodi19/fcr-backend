const notifications = require('../model/notification');

notificationController = {
    add: async (notification) => {
        const notificationData = new notifications({ ...notification});
        await notificationData.save();
    },
    getAll: () => new Promise((resolve, reject) => {
        notifications.find({ })
            .exec()
            .then((data) => {
                resolve({data});
            })
            .catch((error) => {
                reject(error);
            })
    }),
    getAllNotificationByUserID: (userID) => new Promise((resolve, reject) => {
        notifications.find({ user: userID })
            .populate('user', 'name')
            .lean()
            .exec()
            .then((data) => {
                resolve({data});
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
