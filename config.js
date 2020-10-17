let env= {
    prod: {
        mongoUrl:  process.env.mongoUrl,
        ipUrl: 'https://freegeoip.net/json/'
    },
    dev: {
        mongoUrl: process.env.mongoUrl || 'mongodb+srv://fcrdev:fcrdev123@fcr.3ozcv.mongodb.net/FCR?retryWrites=true&w=majority',
        ipUrl: 'https://freegeoip.net/json/',
        avatarBaseUrl: 'https://ui-avatars.com/api/?name=',
        jwtSecret: 'secret'
    }
};
module.exports = env[process.env.environment]|| env['dev'];