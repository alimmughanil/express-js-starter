const tableService = require('../services/table.service');
const { check, validationResult } = require('express-validator');
const { response } = require('../utils/response');

exports.get = async (req, res, next) => {
	try {
		return res.json(await tableService.get(req.user.id));
	} catch (err) {
		next(err);
	}
};
exports.create = async (req, res, next) => {
	req.body.user_id = req.user.id;
	try {
		const validated = validationResult(req);
		if (!validated.isEmpty()) return res.json(response(400, 'Harap masukan data dengan benar', validated));

		return res.json(await tableService.create(req.body));
	} catch (err) {
		next(err);
	}
};
exports.show = async (req, res, next) => {
	try {
		const validateByUserId = await tableService.getByUserId(parseInt(req.params.id), req.user.id);
		if (validateByUserId.payload.status != 200) return res.json(validateByUserId);

		return res.json(await tableService.show(parseInt(req.params.id)));
	} catch (err) {
		next(err);
	}
};
exports.update = async (req, res, next) => {
	try {
		const validated = validationResult(req);
		if (!validated.isEmpty()) return res.json(response(400, 'Harap masukan data dengan benar', validated));

		const validateByUserId = await tableService.getByUserId(parseInt(req.params.id), req.user.id);
		if (validateByUserId.payload.status != 200) return res.json(validateByUserId);

		return res.json(await tableService.update(parseInt(req.params.id), req.body));
	} catch (err) {
		next(err);
	}
};
exports.destroy = async (req, res, next) => {
	try {
		const validateByUserId = await tableService.getByUserId(parseInt(req.params.id), req.user.id);
		if (validateByUserId.payload.status != 200) return res.json(validateByUserId);

		return res.json(await tableService.destroy(parseInt(req.params.id)));
	} catch (err) {
		next(err);
	}
};

exports.validate = (method) => {
	switch (method) {
		case 'createOrUpdate': {
			return [
				check('table_id', 'bidang table_id harus di isi').exists(),
				check('table_data', 'bidang table_data harus di isi').exists(),
			];
		}
	}
};
