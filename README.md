# CineFlex - QA en produccion

> Video de sustentacion (maximo 3 minutos): [agregar enlace del equipo](#).

Base inicial para preparar y validar un mock de CineFlex. El alcance es intencionalmente parcial: los flujos de negocio y la mayoria de los casos de prueba quedan pendientes para los issues del equipo.

## Estructura

```text
.
|-- estrategia_pruebas.pdf       # Plantilla con pendientes de la Fase A
|-- backend/                     # API mock con Express, Helmet y Morgan
|-- frontend/                    # Interfaz HTML/CSS/JS servida por el backend
|-- api_tests/                   # Coleccion Postman y entorno local
|-- ui_tests/                    # Selenium WebDriver y Page Object Model
|   `-- pages/
|-- performance/                 # Plan JMeter
`-- .github/workflows/           # Pipeline Newman
```

## Requisitos

- Node.js 18 o superior y npm 9 o superior.
- Google Chrome para ejecutar la muestra Selenium.
- Apache JMeter 5.5 o superior y Java Runtime Environment 8 o superior para el plan de carga.

## Instalacion y ejecucion

Desde la raiz del repositorio, copia `.env.example` a `.env`. El valor de `JWT_SECRET` de ejemplo es solo para desarrollo local; reemplazalo por una clave local no compartida antes de usar el mock fuera de una maquina de desarrollo.

```powershell
Copy-Item .env.example .env
cd backend
npm ci
npm start
```

El backend sirve tambien la interfaz en <http://localhost:3000/>. `npm run dev` inicia el servidor con nodemon. El mock expone `POST /login`, `GET /cartelera`, `POST /reserva`, `GET /asientos/disponibles` y `GET /health`. Los datos son de muestra: no hay persistencia, autenticacion real ni pasarela bancaria. El endpoint de reserva rechaza intencionalmente la tarjeta de prueba; completar los demas flujos es trabajo pendiente.

## Pruebas de API (Postman / Newman)

Con el servidor ejecutandose, desde la raiz:

```powershell
npx newman run api_tests/CineFlex_API_Collection.json -e api_tests/CineFlex_Environment.json
```

La coleccion de partida verifica login y captura el token en el entorno, consulta autenticada de cartelera y rechazo de una tarjeta falsa. El SLA de cartelera indicado en el taller es menor a 300 ms. Las aserciones adicionales por endpoint quedan como TODO.

## Pruebas UI (Selenium + POM)

Con el servidor ejecutandose en otra terminal:

```powershell
cd ui_tests
npm ci
npm test
```

La suite comprueba el login mock y la carga de una pelicula de muestra. Las clases `pages/` contienen localizadores y acciones, no aserciones. Completar los casos modulares requeridos en el taller (bloqueo tras tres intentos, cobertura adicional de cartelera, compra end-to-end, cierre de sesion y navegacion segura) queda asignado a los issues del equipo.

## Pruebas de rendimiento (JMeter)

Abre `performance/prueba_carga.jmx` en JMeter y ejecuta el plan contra el backend iniciado: configura 500 usuarios virtuales, ramp-up de 15 segundos y consulta de `/asientos/disponibles`. El plan incluye un Summary Report. Adjunta al README la evidencia del throughput y porcentaje de error cuando el equipo ejecute la prueba; no se incluyen resultados inventados.

## Integracion continua (GitHub Actions)

`.github/workflows/qa-pipeline.yml` se ejecuta en `push` y `pull_request` a `main`. Instala el backend, lo inicia y ejecuta la coleccion con Newman; un fallo de aserciones falla el job.

## Pendientes de equipo

- Resolver la estrategia de integracion, requisitos/regresion y comparativa Selenium/Cypress en la plantilla `estrategia_pruebas.pdf`.
- Completar los casos de API y la suite UI de al menos 15 casos del taller.
- Ampliar los mocks de interfaz y backend segun los issues asignados, sin tratarlos como una aplicacion productiva.
- Ejecutar JMeter y agregar capturas/resultados al README.
- Sustituir el enlace placeholder del video de sustentacion.
