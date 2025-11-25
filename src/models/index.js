const sequelize = require('../config/database');
const User = require('./User');
const EmailCode = require('./EmailCode');

// Relaciones
User.hasMany(EmailCode, { foreignKey: 'userId', onDelete: 'CASCADE' });
EmailCode.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
	sequelize,
	User,
	EmailCode,
};
