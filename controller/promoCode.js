const PromoCode = require('../model/promoCodes');

promoCodeController = {
    add: async (promoCode) => {
        const promoCodeData = new PromoCode({ ...promoCode });
        await promoCodeData.save();
    },
    get: () => Promise((resolve, reject) => {
        PromoCode.find({ isActive: true })
            .populate('serviceProvider')
            .lean()
            .exec()
            .then((promoCodes) => {
                resolve(promoCodes)
            })
            .catch((error) => {
                reject(error)
            })
    }),
    getAll: () => new Promise((resolve, reject) => {
        PromoCode.find({})
            .populate('serviceProvider')
            .lean()
            .exec()
            .then((promoCodes) => {
                resolve(promoCodes)
            })
            .catch((error) => {
                reject(error)
            })
    }),
    getbyId: (id) => new Promise((resolve, reject) => {
        PromoCode.findOne({ _id: id })
            .populate('serviceProvider')
            .lean()
            .exec()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    }),
    getbyUserId: (userId) => new Promise((resolve, reject) => {
        PromoCode.find({ user: userId, isActive: true })
            .populate('serviceProvider user')
            .lean()
            .exec()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    }),
    getbyProviderId: (serviceId) => new Promise((resolve, reject) => {
        PromoCode.find({ serviceProvider: serviceId, isActive: true })
            .populate('serviceProvider')
            .lean()
            .exec()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    }),
    update: (id, promoCode) => new Promise((resolve, reject) => {
        PromoCode.findOneAndUpdate({ _id: id }, promoCode)
            .exec()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    }),
    delete: (id) => new Promise((resolve, reject) => {
        PromoCode.findOne({ _id: id })
            .lean()
            .exec()
            .then(async (promoCode) => {
                promoCode.isDeleted = true;
                promoCode.isActive = false;
                await PromoCode.findOneAndUpdate({ _id: promoCode._id }, promoCode);
                resolve({ isSuccess: true, message: 'Promocode deleted' });
            })
            .catch((error) => {
                reject(error);
            })
    })
};

module.exports = promoCodeController;
