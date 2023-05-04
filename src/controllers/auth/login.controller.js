const authService = require('../../services/auth/auth.service');
const { check, validationResult } = require('express-validator');
const { response } = require('../../utils/response');
const jwt = require('jsonwebtoken');

exports.create = async (req, res, next) => {
	try {
		const validated = validationResult(req);
		if (!validated.isEmpty()) return res.json(response(400, 'Harap masukan data dengan benar', validated));

		const getUser = await authService.getByEmail(req.body.email);
		if (getUser.payload.status != 200) return res.json(getUser);

		const checkPassword = await authService.checkPassword(req.body, getUser.payload.data);
		if (checkPassword.payload.status != 200) return res.json(checkPassword);

		const checkAuthenticated = await authService.getByUserId(getUser.payload.data.id);
		delete checkAuthenticated.payload.data;

		if (checkAuthenticated.payload.status == 200) return res.json(checkAuthenticated);

		const user = { id: getUser.payload.data.id };

		const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
			expiresIn: process.env.EXPIRE_ACCESS_TOKEN || '1d',
		});

		const refreshToken = jwt.sign(user, process.env.SECRET_REFRESH_TOKEN, {
			expiresIn: process.env.EXPIRE_REFRESH_TOKEN || '1d',
		});

		const createAuth = await authService.create(accessToken, refreshToken, getUser.payload.data);
		delete createAuth.payload.data;

		createAuth.payload.access_token = accessToken
		return res.json(createAuth);
	} catch (err) {
		next(err);
	}
};

exports.destroy = async (req, res, next) => {
	try {
		const validateByUserId = await authService.getByUserId(req.user.id);
		if (validateByUserId.payload.status != 200) return res.json(validateByUserId);

		return res.json(await authService.destroy(validateByUserId.payload.data.id));
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.guest = async (req, res, next) => {
	try {
		const validated = validationResult(req);
		if (!validated.isEmpty()) return res.json(response(400, 'Harap masukan data dengan benar', validated));

		const getUser = await authService.getByEmail(req.body.email);
		if (getUser.payload.status != 200) return res.json(getUser);

		const checkPassword = await authService.checkPassword(req.body, getUser.payload.data);
		if (checkPassword.payload.status != 200) return res.json(checkPassword);

		const user = { id: getUser.payload.data.id };
		const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN);

		return res.json(await authService.create(accessToken, getUser.payload.data));
	} catch (err) {
		console.error(err.message);
		next(err);
	}
};

exports.validate = (method) => {
	switch (method) {
		case 'create': {
			return [check('email', 'bidang name harus di isi dengan benar').exists().isEmail(), check('password', 'bidang password harus di isi').exists()];
		}
		case 'guest': {
			return [check('name', 'bidang name harus di isi').exists()];
		}
	}
};
