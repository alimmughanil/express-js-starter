const response = (status, message, data = null, meta = null) => {
	let res = {
		payload: {
			status: status,
			message: message,
		},
	};
	if (data) res.payload.data = data;
	if (meta) res.meta = meta;

	return res;
};

module.exports = {
	response,
};
