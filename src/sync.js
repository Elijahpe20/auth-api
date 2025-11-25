const { sequelize } = require('./models');

async function syncDatabase() {
	try {
		await sequelize.authenticate();
		console.log('✅ Conexión a la base de datos exitosa');

		await sequelize.sync({ force: true });
		console.log('✅ Tablas creadas correctamente');

		process.exit(0);
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

syncDatabase();
