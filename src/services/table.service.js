const { PrismaClient } = require('@prisma/client');
const { response } = require('../utils/response');
const prisma = new PrismaClient();

exports.get = async (userId) => {
	let result;
	try {
		result = await prisma.table.findMany({
			where: {
				user_id: userId,
			},
		});
		if (result.length == 0) return response(404, 'Data tidak ditemukan');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Data table berhasil didapatkan';
	return response(200, message, result);
};

exports.create = async (body) => {
	let result;
	try {
		result = await prisma.table.create({
			data: body,
		});
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Data table berhasil ditambahkan';
	return response(200, message, result);
};

exports.show = async (id) => {
	let result;
	try {
		result = await prisma.table.findUnique({
			where: {
				id: id,
			},
		});
		if (!result) return response(404, 'Data tidak ditemukan');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Data table berhasil didapatkan';
	return response(200, message, result);
};

exports.update = async (id, body) => {
	let result;
	try {
		result = await prisma.table.update({
			where: {
				id: id,
			},
			data: body,
		});
		if (!result) return response(500, 'Kesalahan pada server. Gagal mengedit table');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Data table berhasil diupdate';
	return response(200, message, result);
};

exports.destroy = async (id) => {
	let result;
	try {
		result = await prisma.table.delete({
			where: {
				id: id,
			},
		});
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Data table berhasil dihapus';
	return response(200, message, result);
};

exports.getByUserId = async (id, userId) => {
	let result;
	try {
		result = await prisma.table.findFirst({
			where: {
				id: id,
				user_id: userId,
			},
		});
		console.log(id, userId);
		if (!result) return response(404, 'Data tidak ditemukan');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Data table berhasil didapatkan';
	return response(200, message, result);
};
