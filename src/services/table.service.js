const { PrismaClient } = require('@prisma/client');
const { response } = require('../utils/response');
const prisma = new PrismaClient();

exports.get = async () => {
	let result;
	try {
		result = await prisma.table.findMany();
		if (!result) return response(404, 'Data tidak ditemukan');
	} catch (error) {
		return response(500, 'Kesalahan pada server');
	}
	const message = 'Data meja berhasil didapatkan';
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
	const message = 'Data meja berhasil dibuat';
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
	const message = 'Data meja berhasil didapatkan';
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
	} catch (error) {
		if (!result) return response(500, 'Kesalahan pada server');
	}
	const message = 'Data meja berhasil diedit';
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
		console.log(error);
		const message = 'Data meja tidak dapat dihapus karena masih digunakan oleh restoran';
		return response(400, message);
	}
	const message = 'Data meja berhasil dihapus';
	return response(200, message, result);
};
