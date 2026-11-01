# Iatryon API

Iatryon API es una API REST desarrollada con Node.js, Express y MongoDB para la gestión de usuarios, pacientes y citas médicas.

El proyecto está estructurado con una arquitectura modular, separación de responsabilidades, autenticación mediante sesiones, control de acceso basado en roles y comunicación en tiempo real mediante Socket.IO.

## Tecnologías

- Node.js
- Express 5
- MongoDB Atlas
- Mongoose
- JavaScript ES Modules
- dotenv
- bcrypt
- express-session
- connect-mongo
- Socket.IO

## Arquitectura

El proyecto separa responsabilidades en distintas capas:

```text
src/
├── auth/
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
Middlewares
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

Las respuestas de determinadas entidades se transforman mediante mappers antes de ser enviadas al cliente.

## Funcionalidades

### Usuarios

- Creación de usuarios
- Consulta individual y general
- Actualización completa mediante PUT
- Actualización parcial mediante PATCH
- Eliminación de usuarios
- Hash seguro de contraseñas mediante bcrypt
- Restricción de operaciones según rol
- Validación de datos mediante Mongoose

### Pacientes

- Registro de pacientes
- Consulta individual y general
- Actualización completa mediante PUT
- Actualización parcial mediante PATCH
- Eliminación de pacientes
- Validaciones de datos personales y de identificación
- Control de acceso basado en roles

### Citas médicas

- Creación de citas médicas
- Consulta individual y general
- Actualización completa mediante PUT
- Actualización parcial mediante PATCH
- Eliminación de citas
- Tipos de cita:
  - PRIMERA VEZ: 40 minutos
  - SEGUIMIENTO: 20 minutos
- Cálculo automático de duración y hora de finalización
- Validación de existencia y estado del paciente
- Validación de existencia, rol y estado del médico
- Prevención de solapamientos de horarios
- Prevención de citas simultáneas para un mismo paciente
- Registro automático del usuario que crea la cita mediante la sesión activa
- Estados de cita:
  - RESERVADA
  - PAGADA
  - ASISTE
  - NO ASISTE
  - CANCELADA

## Autenticación y sesiones

La API utiliza autenticación basada en sesiones HTTP

Las sesiones se gestionan mediante:

- express-session
- connect-mongo
- MongoDB Atlas como almacenamiento persistente de sesiones

Al iniciar sesión correctamente, se almacena en la sesión información básica del usuario autenticado:

```text
id
role
```

La cookie de sesión utiliza el nombre:

```text
iatryon_session.sid
```

y se configura con:

- `httpOnly`
- `sameSite=lax`
- `secure` en entornos de producción
- Tiempo de expiración de una hora

La contraseña nunca se almacena en texto plano y se valida utilizando bcrypt.

## Control de acceso basado en roles

La API implementa autenticación y autorización mediante middlewares

Roles disponibles:

- ADMIN
- RECEPTIONIST
- DOCTOR

Los permisos principales se distribuyen de la siguiente manera:

```text
ADMIN
- Acceso completo a usuarios
- Acceso completo a pacientes
- Acceso completo a citas

RECEPTIONIST
- Consulta y creación de pacientes
- Actualización de pacientes
- Consulta, creación y actualización de citas

DOCTOR
- Consulta de pacientes
- Consulta de citas
- Creación de citas
```

Las rutas protegidas requieren una sesión válida.

Una solicitud sin autenticación recibe una respuesta HTTP `401 Unauthorized`

Un usuario autenticado que no posea el rol requerido recibe una respuesta HTTP `403 Forbidden`

## Comunicación en tiempo real

La API utiliza Socket.IO para emitir eventos en tiempo real

Actualmente se implementan los siguientes eventos:

```text
userLoggedIn
appointmentCreated
```

### userLoggedIn

Se emite cuando un usuario inicia sesión correctamente

Ejemplo de lo que se transmite:

```json
{
  "userName": "jaguirre"
}
```

### appointmentCreated

Se emite después de crear correctamente una nueva cita médica

El evento transmite la información de la cita creada utilizando el DTO correspondiente

Los clientes Socket.IO pueden conectarse al mismo servidor HTTP:

```text
http://localhost:3000
```

## Manejo de errores

La API utiliza clases de error personalizadas y un middleware global

Entre las respuestas manejadas se encuentran:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

También se gestionan errores propios de Mongoose, incluyendo:

- IDs inválidos
- Violaciones de campos únicos
- Errores de validación del esquema

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/jonathanAguirre1999/iatryon-med-software-api.git
```

Instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000

MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/iatryon_db

SESSION_SECRET="<secreto-aleatorio>"

NODE_ENV=development
```

Ejecuta el proyecto en modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible por defecto en:

```text
http://localhost:3000
```

Colección de Postman incluida para pruebas de distintos escenarios.

## API

### Autenticación

```http
POST /api/auth/login
POST /api/auth/logout
```

Ejemplo de inicio de sesión:

```json
{
  "userName": "jaguirre",
  "password": "contraseña"
}
```

Respuesta exitosa:

```json
{
  "message": "Inicio de sesión exitoso"
}
```

### Usuarios

```http
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

Las operaciones de usuarios requieren rol `ADMIN`

### Pacientes

```http
GET    /api/patients
GET    /api/patients/:id
POST   /api/patients
PUT    /api/patients/:id
PATCH  /api/patients/:id
DELETE /api/patients/:id
```

### Citas

```http
GET    /api/appointments
GET    /api/appointments/:id
POST   /api/appointments
PUT    /api/appointments/:id
PATCH  /api/appointments/:id
DELETE /api/appointments/:id
```

Ejemplo de creación de cita:

```json
{
  "patientId": "OBJECT_ID_DEL_PACIENTE",
  "doctorId": "OBJECT_ID_DEL_DOCTOR",
  "appointmentType": "PRIMERA VEZ",
  "startAt": "2026-11-03T10:00:00-05:00",
  "reason": "Consulta médica"
}
```

El campo `createdBy` no se recibe desde el cliente

Se obtiene automáticamente a partir del usuario autenticado:

```text
req.session.user.id
```

Esto evita que el cliente pueda indicar manualmente qué usuario creó una cita

## Persistencia

La API utiliza MongoDB Atlas mediante Mongoose

Entre las entidades principales se encuentran:

```text
User
Patient
Appointment
Session
```

Las sesiones también se almacenan en MongoDB mediante connect-mongo

## Pruebas

Los endpoints han sido probados mediante Postman.

Entre los escenarios verificados se encuentran:

- Login correcto
- Credenciales incorrectas
- Creación y destrucción de sesiones
- Acceso a endpoints protegidos
- Respuesta 401 sin autenticación
- Respuesta 403 con rol insuficiente
- CRUD de usuarios
- CRUD de pacientes
- CRUD de citas
- Validaciones de datos
- Detección de conflictos de horario
- Registro automático de `createdBy`
- Recepción del evento `userLoggedIn`
- Recepción del evento `appointmentCreated`

Socket.IO también fue probado mediante el cliente Socket.IO de Postman

## Estado del proyecto

### Funcional

Actualmente la API cuenta con:

- Persistencia en MongoDB Atlas
- Gestión de usuarios
- Gestión de pacientes
- Gestión de citas
- Autenticación mediante sesiones
- Hash seguro de contraseñas
- Control de acceso basado en roles
- Manejo centralizado de errores
- Validaciones de negocio
- Comunicación en tiempo real mediante Socket.IO

El proyecto continúa abierto a futuras mejoras y nuevas funcionalidades

## Autor

Jonathan Aguirre
