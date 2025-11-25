const express = require('express');
const router = express.Router();
const {
	createUser,
	verifyUser,
	login,
	getMe,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
} = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

// Rutas públicas
router.post('/', createUser);
router.get('/verify/:code', verifyUser);
router.post('/login', login);

// Rutas protegidas (requieren token)
router.get('/me', authenticate, getMe);
router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
