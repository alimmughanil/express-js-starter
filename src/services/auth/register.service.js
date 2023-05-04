const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { response } = require('../../utils/response');
const prisma = new PrismaClient();

exports.create = async (body) => {
	let result;
	const salt = await bcrypt.genSalt(10);
	const rememberToken = await bcrypt.genSalt(16);
	const hashedPassword = await bcrypt.hash(body.password, salt);

	try {
		result = await prisma.user.create({
			data: {
				name: body.name,
				phone: body.phone,
				email: body.email,
				password: hashedPassword,
				role: body.role ? body.role.toLowerCase() : 'user',
				remember_token: rememberToken,
			},
		});
	} catch (error) {
		console.log(error);
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Data pengguna berhasil dibuat';
	return response(200, message, result);
};
exports.guest = async (body) => {
	let result;
	try {
		result = await prisma.user.create({
			data: {
				name: body.name,
				role: 'guest',
			},
		});
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Data pengguna berhasil dibuat';
	return response(200, message, result);
};

exports.getByEmail = async (email) => {
	try {
		result = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		if (!result) return { status: 404 };
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	return response(200, 'Email sudah digunakan oleh yang akun lain');
};
exports.getByPhone = async (phone) => {
	try {
		result = await prisma.user.findFirst({
			where: {
				phone: phone,
			},
		});
		if (!result) return { status: 404 };
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	return response(200, 'Phone sudah digunakan oleh yang akun lain');
};
