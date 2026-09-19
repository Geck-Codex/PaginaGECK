# Pasar de los CSV a la API de GA4

Leer esto solo cuando el proceso manual empiece a estorbar: descargar seis CSV
cada mes es tolerable una vez al mes y odioso una vez por semana. Mientras el
informe sea mensual, los CSV funcionan y no hay nada que ganar migrando.

## Lo que ya está resuelto

`ingest.py` existe precisamente para que este cambio no toque el análisis. Todo
lo demás —`informe.py`, el criterio del SKILL.md, los informes anteriores— habla
contra `dataset.json`, no contra los CSV. Cambiar de fuente es implementar
`ingesta_api()` para que devuelva un diccionario con la misma forma, y nada más.

## El contrato de dataset.json

```jsonc
{
  "generado": "2026-09-18T12:00:00-06:00",
  "backend": "ga4api",
  "periodo": { "inicio": "2026-09-01", "fin": "2026-09-30" },
  "fuentes": [ { "archivo": "runReport:canales", "tablas": 1, "periodo": null } ],
  "ga4": {
    // Cada seccion es una lista de filas. Una fila mezcla dimensiones (texto)
    // y metricas (numeros), con las claves normalizadas de ingest.py:
    // canal, pagina, evento, dispositivo, pais, ciudad, fecha, metodo...
    // sesiones, usuarios, sesiones_con_interaccion, vistas, eventos, eventos_clave.
    "canales":     [ { "canal": "Direct", "sesiones": 49, "usuarios": 41 } ],
    "paginas":     [ { "pagina": "/", "vistas": 1240, "usuarios": 52 } ],
    "eventos":     [ { "evento": "generate_lead", "eventos": 12, "eventos_clave": 0 } ],
    "dispositivos": [], "paises": [], "ciudades": [], "serie": []
  },
  "gsc": { "consultas": [], "paginas": [], "indexacion": [] },
  "avisos": []
}
```

Dos detalles que parecen menores y no lo son:

- **`_total`**: las filas de totales van marcadas con `"_total": true` y la
  función `suma()` las salta. La API no devuelve filas de total, así que desde
  este backend simplemente no se pone. Lo que no se puede hacer es olvidarse y
  dejar que un total entre como una fila más: duplica todas las cifras.
- **Los nombres de dimensión son los normalizados**, en español y sin acentos
  (`canal`, no `sessionDefaultChannelGroup`). Traducirlos en el backend, no
  después: si cada fuente trae sus propios nombres, el análisis vuelve a
  depender de la fuente y toda esta capa deja de servir.

`derivar()` se ejecuta igual sobre cualquier backend; no hay que tocarla.

## Los pasos

1. **Habilitar la API** en un proyecto de Google Cloud: APIs y servicios →
   Biblioteca → "Google Analytics Data API" → Habilitar. Es fácil saltárselo
   porque la credencial se crea igual sin ella; el síntoma es un 403 en la
   primera llamada que no menciona en ningún momento que la API está apagada.
2. **Cuenta de servicio** en ese mismo proyecto, sin rol de Cloud (los permisos
   que importan se dan en GA4, paso 3). Crear la clave JSON y guardarla **fuera
   del repo** (por ejemplo en `~/.config/geckcodex/ga4.json`); esa clave sí es
   un secreto, a diferencia del ID de medición.
3. **Dar acceso a la propiedad**: en GA4, Administrar → Gestión de accesos a la
   propiedad → añadir el correo de la cuenta de servicio como *Lector*.
4. **El ID numérico de la propiedad** está en Administrar → Detalles de la
   propiedad. No es el `G-NCC4TMJN98`, que es el ID de medición del flujo de
   datos; confundirlos es el error habitual y da un 403 poco explicativo.
5. `pip install google-analytics-data`
6. Implementar `ingesta_api()` con `BetaAnalyticsDataClient.run_report()`, una
   llamada por sección. Correspondencia de nombres:

   | Sección | Dimensión de la API | Métricas |
   |---|---|---|
   | canales | `sessionDefaultChannelGroup` | `sessions`, `activeUsers`, `engagedSessions` |
   | paginas | `pagePath` | `screenPageViews`, `activeUsers`, `userEngagementDuration` |
   | eventos | `eventName` | `eventCount`, `keyEvents` |
   | leads | `eventName`, `customEvent:method`, `customEvent:where` | `eventCount` |
   | dispositivos | `deviceCategory` | `sessions` |
   | ciudades | `city` | `sessions` |
   | serie | `date` | `sessions`, `activeUsers` |

   `customEvent:method` solo devuelve datos si la dimensión personalizada está
   creada en GA4 (ver `ga4-exports.md`) y solo desde la fecha en que se creó.

7. Guardar la ruta de la credencial en `GOOGLE_APPLICATION_CREDENTIALS` y
   comprobar que `--backend ga4api` produce las mismas cifras que el CSV del
   mismo mes antes de fiarse. Si no cuadran, casi siempre es la zona horaria de
   la propiedad o un filtro de datos interno activo en GA4.

**Search Console tiene su propia API** (`searchconsole.googleapis.com`, método
`searchanalytics.query`), con otra credencial y otro alcance. No hace falta
hacer las dos a la vez: GA4 es la que más se consulta.
