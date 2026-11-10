# API del directorio — clases 3 a 6

Requiere Node.js 24 y un servicio MongoDB (Community, Docker o Atlas). Compass es un cliente; por sí solo no garantiza que el motor esté instalado.

Desde la raíz del proyecto, en PowerShell:

```powershell
npm install --prefix server
Copy-Item server/.env.example server/.env
# Edita server/.env con tu conexión MongoDB.
npm run dev --prefix server
```

El ejemplo usa `mongodb://127.0.0.1:27017`, base `directorio-db` y puerto `8080`. Si tu MongoDB usa autenticación, incluye las credenciales y `authSource` correspondientes en `MONGODB_URI`. `.env` está excluido de Git; `.env.example` contiene únicamente configuración local de ejemplo.

El servidor espera la conexión antes de escuchar. Si falta la URI o MongoDB no está disponible, termina con error sin aceptar solicitudes. No inserta datos automáticamente al iniciar.

En otra terminal, desde la raíz:

```powershell
npm start
```

Abre `http://localhost:4200/directory` o el enlace **Directorio**. Angular permite buscar, crear, editar y eliminar personas; los datos se guardan en MongoDB. El proxy de desarrollo envía `/api/**` a `http://127.0.0.1:8080`. Si cambias `PORT`, actualiza `proxy.conf.json`. Para producción configura el servidor web para enviar `/api` al backend.

## Contrato HTTP

Las personas del directorio son diferentes de las cuentas de FreeHub. Se renombraron los controladores y rutas de ejemplo de `/api/users` a `/api/persons`, como se hace en clase. Se retiró `/migrate`, que solo devolvía 501 y no forma parte del CRUD explicado.

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/api/persons` | 200 con un arreglo de personas |
| GET | `/api/persons?searchTerm=ana` | Búsqueda parcial por nombre o username, sin distinguir mayúsculas |
| GET | `/api/persons/:id` | 200 con una persona; 404 si no existe |
| POST | `/api/persons` | 201 con `{ ok, message, data }` |
| PUT | `/api/persons/:id` | 200 con `{ ok, message, data }` actualizado |
| DELETE | `/api/persons/:id` | 200 con `{ ok, message }`; 404 si no existe |

POST y PUT reciben JSON con `name`, `email` y `username` como textos no vacíos. `image` es opcional y su valor por defecto es `""`. PUT reemplaza estos campos completos. El ID se genera en MongoDB como `_id` (texto hexadecimal de 24 caracteres); no se recibe desde el body. Campos extra se ignoran.

Ejemplo en PowerShell:

```powershell
$body = @{ name = 'Ana'; username = 'ana'; email = 'ana@example.com'; image = '' } | ConvertTo-Json
$created = Invoke-RestMethod http://localhost:8080/api/persons -Method Post -ContentType application/json -Body $body
Invoke-RestMethod "http://localhost:8080/api/persons/$($created.data._id)"
Invoke-RestMethod 'http://localhost:8080/api/persons?searchTerm=ANA'
```

Los errores devuelven `{ ok: false, message }`: 400 para body, JSON, filtro o ID inválidos; 404 para una persona o ruta inexistente; 500 para errores del servidor. Las búsquedas interpretan los símbolos de regex como texto literal. El esquema valida campos requeridos también en las actualizaciones. La colección es explícitamente `people`, que es la que termina utilizando la clase 5.

## Conceptos aplicados

- Clase 3: `req.body`, validación, `req.params.id`, `req.query.searchTerm` y códigos HTTP.
- Clase 4: variables de entorno, separación de personas y usuarios, conexión asíncrona con Mongoose.
- Clase 5: esquema/modelo, colección `people`, `find`, `save`, `deleteOne` y comprobación de `deletedCount`.
- Clase 6: filtro `$or`/`$regex`/`$options`, `findById`, `findByIdAndUpdate`, errores y resultados inexistentes. Se usa `returnDocument: 'after'`, equivalente actual de `new: true`, para devolver la versión actualizada sin usar una opción obsoleta de Mongoose.

JWT, autenticación y autorización se presentan conceptualmente al final de la clase 6 para implementarse en la siguiente clase. No se agregan todavía tokens ni contraseñas: los perfiles de FreeHub siguen siendo de demostración y las rutas de personas son públicas.

## Verificación

```powershell
npm run build --prefix server
npm test --prefix server
npm run build
npm test -- --watch=false
```

Las pruebas del servidor levantan una instancia MongoDB temporal con `mongodb-memory-server`, verifican CRUD real, persistencia, filtros y errores, y la cierran al finalizar. No usan la base configurada en `.env`. La primera ejecución descarga el binario MongoDB y necesita acceso a internet.
