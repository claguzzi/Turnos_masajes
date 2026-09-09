# Espacio Zen — reservas de masajes

La aplicación tiene dos proyectos: `client` (React/Vite) y `server` (Express/PostgreSQL).

## Configuración

En `server/.env` configurá `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `EMAIL_USER`, `EMAIL_PASS`, `MP_ACCESS_TOKEN` y un valor largo y aleatorio para `ADMIN_SESSION_SECRET`.

En producción, definí `VITE_API_URL` en el hosting del cliente con la URL pública del backend y el sufijo `/api`. Si no existe, el cliente utiliza `http://localhost:3001/api` para desarrollo local.

## Ejecución local

En dos terminales:

```powershell
cd server
npm start
```

```powershell
cd client
npm run dev
```

La consulta pública de horarios devuelve únicamente las horas ocupadas para una fecha. El listado completo, y cualquier cambio o eliminación de turnos, requiere iniciar sesión como administrador. El correo de confirmación se envía únicamente desde el backend al crear una reserva; no hay un endpoint público de envío de correos.
