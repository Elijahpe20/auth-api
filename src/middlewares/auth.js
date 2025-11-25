const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({ error: 'Token no proporcionado' });
		}

		const decoded = verifyToken(token);

		if (!decoded) {
			return res.status(401).json({ error: 'Token inválido' });
		}

		const user = await User.findByPk(decoded.id);

		if (!user) {
			return res.status(401).json({ error: 'Usuario no encontrado' });
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ error: 'No autorizado' });
	}
};

module.exports = { authenticate };
