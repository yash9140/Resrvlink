const express = require('express');
const router = express.Router();
const { getAllTables, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { createTableValidators, updateTableValidators } = require('../validators/tableValidators');
const validate = require('../middleware/validate');

router.get('/', verifyToken, getAllTables);
router.post('/', verifyToken, requireAdmin, createTableValidators, validate, createTable);
router.put('/:id', verifyToken, requireAdmin, updateTableValidators, validate, updateTable);
router.delete('/:id', verifyToken, requireAdmin, deleteTable);

module.exports = router;
