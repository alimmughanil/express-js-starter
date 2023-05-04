const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', require('./src/routes/auth/register.router'));
app.use('/login', require('./src/routes/auth/login.router'));
app.use('/logout', require('./src/routes/auth/logout.router'));

app.use('/table', require('./src/routes/table.router'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	payload = {
		status_code: 404,
		status_message: 'Page Not Found',
	};
	res.status(404).json({ payload });
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
