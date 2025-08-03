# PlagiSmart Mobile Admin

Aplicación móvil de administración para PlagiSmart.

## Características

- 🔐 **Autenticación**: Login seguro para administradores
- 📊 **Dashboard**: Vista general de estadísticas del sistema
- 📋 **Solicitudes**: Gestión de solicitudes de fumigación (aprobar/rechazar)
- 👥 **Usuarios**: Administración de usuarios y roles
- 🏭 **Lotes**: Seguimiento de lotes en servicio
- ✅ **Servicios**: Historial de servicios completados

## Tecnologías

- **React Native** con Expo Router
- **TypeScript** para tipado estático
- **AsyncStorage** para almacenamiento local
- **React Navigation** para navegación
- **Expo** como framework de desarrollo

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
```

3. Ejecutar la aplicación:

```bash
# Desarrollo
npm start

# iOS
npm run ios

# Android
npm run android
```

## Configuración

### Variables de entorno

Crear un archivo `.env` con:

```
EXPO_PUBLIC_API_URL=http://tu-servidor-api.com/api
```

### Estructura del proyecto

```
mobile/
├── app/                    # Páginas y navegación (Expo Router)
│   ├── (tabs)/            # Pestañas principales
│   │   ├── index.tsx      # Dashboard
│   │   ├── requests.tsx   # Solicitudes
│   │   ├── users.tsx      # Usuarios
│   │   ├── lots.tsx       # Lotes
│   │   └── services.tsx   # Servicios
│   ├── login.tsx          # Pantalla de login
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
│   ├── AdminLayout.tsx    # Layout para páginas de admin
│   └── ProtectedRoute.tsx # Componente de protección de rutas
├── context/               # Context API
│   └── AuthContext.tsx    # Context de autenticación
├── services/              # Servicios de API
│   ├── api/
│   │   └── apiService.ts  # Cliente HTTP base
│   ├── auth/
│   │   └── loginService.ts # Servicio de autenticación
│   ├── fumigationService.ts # Servicio de fumigación
│   └── usersService.ts    # Servicio de usuarios
└── types/                 # Tipos TypeScript
    └── request.ts         # Tipos de datos de la API
```

## Funcionalidades por rol

### Administrador (ROLE_ADMIN)

- ✅ Dashboard con estadísticas generales
- ✅ Gestión de solicitudes de fumigación
- ✅ Administración de usuarios y roles
- ✅ Seguimiento de lotes activos
- ✅ Historial de servicios completados

## API Integration

La aplicación se conecta con la API backend para:

- Autenticación de usuarios
- Gestión de solicitudes de fumigación
- Administración de usuarios
- Seguimiento de lotes y servicios

### Endpoints utilizados

- `POST /auth/login` - Autenticación
- `GET /fumigation/applications/pending` - Solicitudes pendientes
- `GET /fumigation/applications/rejected` - Solicitudes rechazadas
- `POST /fumigation/applications/{id}/approve` - Aprobar solicitud
- `POST /fumigation/applications/{id}/reject` - Rechazar solicitud
- `GET /users` - Obtener todos los usuarios
- `GET /users/role/{role}` - Usuarios por rol
- `PATCH /users/{id}/role` - Cambiar rol de usuario
- `DELETE /users/{id}` - Eliminar usuario
- `GET /fumigation/lots/active` - Lotes activos
- `GET /fumigation/services/completed` - Servicios completados

## Desarrollo

### Scripts disponibles

```bash
npm start          # Iniciar servidor de desarrollo
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS
npm run web        # Ejecutar en web
npm run lint       # Ejecutar linter
```

### Notas importantes

- Solo usuarios con rol `ROLE_ADMIN` pueden acceder a la aplicación
- La autenticación se almacena localmente usando AsyncStorage
- La aplicación funciona en modo offline limitado (solo datos previamente cargados)

## Despliegue

Para construir la aplicación para producción:

```bash
# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```
