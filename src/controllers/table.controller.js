const tableService = require('../services/table.service');
const { check, validationResult } = require('express-validator');
const { response } = require('../utils/response');

exports.get = async (req, res, next) => {
	try {
		res.json(await tableService.get());
	} catch (err) {
		console.error(err.message);
		next(err);
	}
};
exports.create = async (req, res, next) => {
	try {
		const validated = validationResult(req);
		if (!validated.isEmpty()) res.json(response(400, 'Harap masukan data dengan benar', validated));

		res.json(await tableService.create(req.body));
	} catch (err) {
		console.error(err.message);
		next(err);
	}
};
exports.show = async (req, res, next) => {
	try {
		res.json(await tableService.show(parseInt(req.params.id)));
	} catch (err) {
		console.error(err.message);
		next(err);
	}
};
exports.update = async (req, res, next) => {
	try {
		const validated = validationResult(req);
		if (!validated.isEmpty()) res.json(response(400, 'Harap masukan data dengan benar', validated));

		res.json(await tableService.update(parseInt(req.params.id), req.body));
	} catch (err) {
		console.error(err.message);
		next(err);
	}
};
exports.destroy = async (req, res, next) => {
	try {
		res.json(await tableService.destroy(parseInt(req.params.id)));
	} catch (err) {
		console.error(err.message);
		next(err);
	}
};

exports.validate = (method) => {
	switch (method) {
		case 'createOrUpdate': {
			return [check('table_data', 'bidang table_data harus di isi').exists(), check('table_number', 'bidang table_number harus di isi').exists()];
		}
	}
};
