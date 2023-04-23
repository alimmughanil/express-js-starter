const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller');

router.get('/', tableController.get);
router.post('/', tableController.validate('createOrUpdate'), tableController.create);
router.get('/:id', tableController.show);
router.put('/:id', tableController.validate('createOrUpdate'), tableController.update);
router.delete('/:id', tableController.destroy);

module.exports = router;
