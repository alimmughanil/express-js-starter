const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, tableController.get);
router.post('/', verifyToken, tableController.validate('createOrUpdate'), tableController.create);
router.get('/:id', verifyToken, tableController.show);
router.put('/:id', verifyToken, tableController.validate('createOrUpdate'), tableController.update);
router.delete('/:id', verifyToken, tableController.destroy);

module.exports = router;
