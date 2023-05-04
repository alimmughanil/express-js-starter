const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { response } = require('../../utils/response');
const prisma = new PrismaClient();

exports.create = async (accessToken, refreshToken, user) => {
	let result = await prisma.auth.create({
		data: {
			user_id: user.id,
			refresh_token: refreshToken,
		},
	});
	result.access_token = accessToken
	const message = 'Data akses token berhasil dibuat';
	return response(200, message, result);
};
exports.destroy = async (id) => {
	let result;
	try {
		result = await prisma.auth.delete({
			where: {
				id: id,
			},
		});
		if (!result) return response(400, 'Otentikasi pengguna gagal dihapus');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Otentikasi pengguna telah dihapus. Harap login kembali';
	return response(200, message);
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
	const message = 'Data otentikasi pengguna berhasil dibuat';
	return response(200, message, result);
};

exports.getByUserId = async (userId) => {
	let result;
	try {
		result = await prisma.auth.findFirst({
			where: {
				user_id: userId,
			},
		});
		if (!result) return response(400, 'Pengguna tidak otentikasi');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Pengguna sudah otentikasi';
	return response(200, message, result);
};
exports.checkPassword = async (body, user) => {
	let result;
	try {
		result = await bcrypt.compare(body.password, user.password);
		if (!result) return response(400, 'Password tidak valid');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Password valid';
	return response(200, message, result);
};

exports.getByEmail = async (email) => {
	let result;
	try {
		result = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		if (!result) return response(404, 'Email tidak ditemukan');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	return response(200, 'Pengguna ditemukan', result);
};
exports.getByPhone = async (phone) => {
	try {
		result = await prisma.user.findFirst({
			where: {
				phone: phone,
			},
		});
		if (!result) return response(404, 'Phone tidak ditemukan');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	return { status: 200 };
};
