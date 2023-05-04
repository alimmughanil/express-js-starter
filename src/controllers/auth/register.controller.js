const registerService = require('../../services/auth/register.service');
const { check, validationResult } = require('express-validator');
const { response } = require('../../utils/response');

exports.create = async (req, res, next) => {
	try {
		const validated = validationResult(req);
		if (!validated.isEmpty()) return res.json(response(400, 'Harap masukan data dengan benar', validated));

		const getExistEmail = await registerService.getByEmail(req.body.email);
		if (getExistEmail.status != 404) return res.json(getExistEmail);

		const getExistPhone = await registerService.getByPhone(req.body.phone);
		if (getExistPhone.status != 404) return res.json(getExistPhone);

		return res.json(await registerService.create(req.body));
	} catch (err) {
		console.error(err.message);
		next(err);
	}
};
exports.guest = async (req, res, next) => {
	try {
		const validated = validationResult(req);
		if (!validated.isEmpty()) return res.json(response(400, 'Harap masukan data dengan benar', validated));

		return res.json(await registerService.guest(req.body));
	} catch (err) {
		console.error(err.message);
		next(err);
	}
};

exports.validate = (method) => {
	switch (method) {
		case 'create': {
			return [
				check('name', 'bidang name harus di isi').exists(),
				check('phone', 'bidang phone harus di isi dengan benar').exists().isMobilePhone('id-ID'),
				check('email', 'bidang name harus di isi dengan benar').exists().isEmail(),
				check('password', 'bidang password harus di isi').exists(),
			];
		}
		case 'guest': {
			return [check('name', 'bidang name harus di isi').exists()];
		}
	}
};
