let env= {
    prod: {
        mongoUrl:  process.env.mongoUrl,
        ipUrl: 'https://freegeoip.net/json/'
    },
    dev: {
        mongoUrl: process.env.mongoUrl || 'mongodb://localhost:27017/FCR',
        ipUrl: 'https://freegeoip.net/json/'
    }
};
module.exports = env[process.env.environment]|| env['dev'];