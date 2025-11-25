const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, EmailCode } = require('../models');
const { sendVerificationEmail } = require('../utils/mailer');
const { generateToken } = require('../utils/jwt');

// Crear usuario
const createUser = async (req, res) => {
	try {
		const { first_name, last_name, email, password, country, image } = req.body;

		// Verificar si el email ya existe
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ error: 'El email ya está registrado' });
		}

		// Encriptar contraseña
		const hashedPassword = await bcrypt.hash(password, 10);

		// Crear usuario
		const user = await User.create({
			first_name,
			last_name,
			email,
			password: hashedPassword,
			country,
			image,
		});

		// Generar código de verificación
		const code = crypto.randomBytes(32).toString('hex');

		// Guardar código en la base de datos
		await EmailCode.create({
			code,
			userId: user.id,
		});

		// Enviar email de verificación
		await sendVerificationEmail(email, code);

		res.status(201).json({
			message: 'Usuario creado. Revisa tu email para verificar tu cuenta.',
			user: {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Verificar usuario
const verifyUser = async (req, res) => {
	try {
		const { code } = req.params;

		// Buscar el código
		const emailCode = await EmailCode.findOne({ where: { code } });

		if (!emailCode) {
			return res.status(404).json({ error: 'Código no encontrado' });
		}

		// Buscar el usuario
		const user = await User.findByPk(emailCode.userId);

		if (!user) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}

		// Actualizar usuario como verificado
		user.isVerified = true;
		await user.save();

		// Eliminar el código
		await emailCode.destroy();

		res.json({ message: 'Usuario verificado exitosamente' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Login
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Buscar usuario
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(401).json({ error: 'Credenciales inválidas' });
		}

		// Verificar contraseña
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			return res.status(401).json({ error: 'Credenciales inválidas' });
		}

		// Verificar si el usuario está verificado
		if (!user.isVerified) {
			return res
				.status(401)
				.json({ error: 'Usuario no verificado. Revisa tu email.' });
		}

		// Generar token
		const token = generateToken(user);

		res.json({
			message: 'Login exitoso',
			user: {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				country: user.country,
				image: user.image,
			},
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Obtener usuario logueado
const getMe = async (req, res) => {
	try {
		const user = req.user;

		res.json({
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			country: user.country,
			image: user.image,
			isVerified: user.isVerified,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
	try {
		const users = await User.findAll({
			attributes: { exclude: ['password'] },
		});

		res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findByPk(id, {
			attributes: { exclude: ['password'] },
		});

		if (!user) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}

		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Actualizar usuario
const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { first_name, last_name, country, image } = req.body;

		const user = await User.findByPk(id);

		if (!user) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}

		await user.update({ first_name, last_name, country, image });

		res.json({
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			country: user.country,
			image: user.image,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Eliminar usuario
const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findByPk(id);

		if (!user) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}

		await user.destroy();

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	createUser,
	verifyUser,
	login,
	getMe,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
};
