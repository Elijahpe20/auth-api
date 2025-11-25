const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmailCode = sequelize.define(
	'EmailCode',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id',
			},
		},
	},
	{
		tableName: 'email_codes',
		timestamps: true,
	},
);

module.exports = EmailCode;
