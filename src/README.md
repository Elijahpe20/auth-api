# Auth API

API REST de autenticación de usuarios con verificación por email.

## 🚀 URL de la API

**Producción:** https://auth-api-9lw9.onrender.com

## 📋 Endpoints

### Rutas Públicas

#### Crear usuario

```http
POST /users
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "country": "USA",
  "image": "https://example.com/john.jpg"
}
```

Envía un email de verificación al usuario.

#### Verificar usuario

```http
GET /users/verify/:code
```

Verifica la cuenta del usuario usando el código enviado por email.

#### Login

```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Retorna un token JWT para autenticación.

---

### Rutas Protegidas (requieren token)

Todas estas rutas requieren el header:

```
Authorization: Bearer {token}
```

#### Obtener usuario logueado

```http
GET /users/me
```

#### Obtener todos los usuarios

```http
GET /users
```

#### Obtener usuario por ID

```http
GET /users/:id
```

#### Actualizar usuario

```http
PUT /users/:id
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Updated"
}
```

#### Eliminar usuario

```http
DELETE /users/:id
```

---

## 🛠️ Tecnologías

- Node.js
- Express
- Sequelize
- PostgreSQL
- Bcrypt (encriptación de contraseñas)
- JWT (autenticación)
- Nodemailer (envío de emails)
- Mailtrap (testing de emails)

## 📦 Instalación Local

1. Clonar el repositorio:

```bash
git clone https://github.com/Elijahpe20/auth-api.git
cd auth-api
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno (crear archivo `.env`):

```
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db
PORT=3000
JWT_SECRET=tu_secreto_jwt
NODE_ENV=development
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=tu_mailtrap_user
MAIL_PASSWORD=tu_mailtrap_password
FRONTEND_URL=http://localhost:3000
```

4. Crear la base de datos:

```bash
psql -U postgres
CREATE DATABASE auth_db;
\q
```

5. Sincronizar tablas:

```bash
node src/sync.js
```

6. Iniciar servidor:

```bash
npm start
```

## 👤 Autor

Elijah Vilcachagua
