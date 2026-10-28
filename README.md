# Iatryon API

Iatryon API es una API REST desarrollada con Node.js, Express y MongoDB para la gestión de usuarios, pacientes y citas médicas.

El proyecto nace como un proyecto de desarrollo backend, se está estructurando con una arquitectura modular y mantenible.

## Tecnologías

- Node.js
- Express 5
- MongoDB Atlas
- Mongoose
- dotenv
- JavaScript ES Modules

## Arquitectura

El proyecto separa responsabilidades en distintas capas:

```text
src/
├── config/
├── controllers/
├── errors/
├── mappers/
├── middlewares/
├── models/
├── routes/
├── services/
├── sockets/
└── app.js
```

El flujo principal de una petición es:

```text
Request
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models / Mongoose
   ↓
MongoDB
```

Los errores se manejan mediante un middleware global y clases de error personalizadas.

## Funcionalidades actuales

- Conexión con MongoDB Atlas mediante Mongoose.
- CRUD de usuarios.
- Separación entre controllers, services, models y routes.
- DTOs de respuesta mediante mappers.
- Manejo centralizado de errores.
- Variables de entorno mediante dotenv.

## Funcionalidades planificadas

- Gestión de pacientes.
- Gestión de citas médicas.
- Validación de disponibilidad de médicos.
- Roles de usuario:
  - Administrador.
  - Recepcionista.
  - Médico.
- Autenticación.
- Control de acceso basado en roles y permisos.
- Hash seguro de contraseñas.
- Gestión de sesiones.
- Carga de archivos.
- Comunicación en tiempo real para eventos relacionados con citas.
- Validaciones y manejo especializado de errores de Mongoose.

## Instalación

Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd iatryon-api
```

Instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/iatryon_db
```

Ejecuta el proyecto en modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible por defecto en:

```text
http://localhost:3000
```

## API

Actualmente los endpoints de usuarios se encuentran bajo:

```text
/api/users
```

Ejemplos:

```http
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

## Estado del proyecto

### En desarrollo.

Actualmente se está construyendo la base de persistencia, manejo de errores y arquitectura del backend antes de implementar autenticación, pacientes y citas médicas.

## Autor

Jonathan Aguirre
