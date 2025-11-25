const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
	res.json({ message: 'Auth API funcionando!' });
});

app.use('/users', userRoutes);

// Endpoint temporal para sincronizar base de datos (SOLO PARA DESARROLLO)
app.get('/sync-database', async (req, res) => {
	try {
		await sequelize.sync({ force: false });
		res.json({ message: 'Tablas sincronizadas correctamente' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Iniciar servidor
sequelize
	.authenticate()
	.then(() => {
		console.log('✅ Conexión a la base de datos exitosa');
		app.listen(PORT, () => {
			console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error('❌ Error al conectar a la base de datos:', err);
	});
