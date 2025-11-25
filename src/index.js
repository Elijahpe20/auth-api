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
