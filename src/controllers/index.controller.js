const { check, validationResult } = require('express-validator');
const { response } = require('../utils/response');

exports.get = async (req, res, next) => {
	try {
		const data = {
			documentation_api: ""
		}
		res.json(response(200, "Selamat Datang", data));
	} catch (err) {
		console.error(err.message);
		next(err);
	}
};
