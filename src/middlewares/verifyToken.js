const jwt = require('jsonwebtoken');
const { response } = require('../utils/response');
const authService = require('../services/auth/auth.service');

const verifyToken = async (req, res, next) => {
	const isJWTAuth = process.env.JWT_AUTH
	if (isJWTAuth == "false") {
		let user = { id: 1 }
		req.user = user;
		return next()
	}

	const auth = req.headers['authorization'];
	if (typeof auth == 'undefined') return res.json(response(403, 'Akses token tidak ditemukan'));
	const bearer = auth.split(' ');
	const token = bearer[1];
	try {
		let user = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
		req.user = user;
		next();
	} catch (error) {
		const user = jwt.decode(token)
		if (!user) return res.json(response(403, 'Akses token tidak ditemukan'));

		const checkAuthenticated = await authService.getByUserId(user.id);
		if (checkAuthenticated.payload.status != 200) return res.json(response(403, 'Akses token tidak valid. Harap login kembali'));

		const refreshToken = checkAuthenticated.payload.data.refresh_token

		jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (error, user) => {
			if (error) return res.json(authService.destroy(checkAuthenticated.payload.data.id));
			req.user = user;
			next();
		});
	}
}

module.exports = verifyToken;
