const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

// routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const serviceProviderRouter = require('./routes/serviceProvider');
const notificationsRouter = require('./routes/notification');
const promoCodeRouter = require('./routes/promocodes');
const chatRouter = require('./routes/chat');

// middleware
const middleware = require('./handler/middleware');

const app = express();
// enable cors
app.use(cors('*'));

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/users', middleware.authUser, usersRouter.router);
app.use('/serviceProvider', middleware.authUser, serviceProviderRouter);
app.use('/notifications', middleware.authUser, notificationsRouter);
app.use('/promoCodes', middleware.authUser, promoCodeRouter);
app.use('/chat', middleware.authUser, chatRouter);

app.post('/login', (req, res) => {
	return usersRouter.login(req, res);
});
app.post('/register', function (req, res, next) {
	return usersRouter.register(req, res);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500).send(err);
});

module.exports = app;
