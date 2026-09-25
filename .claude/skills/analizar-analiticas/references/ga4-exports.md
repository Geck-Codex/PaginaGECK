# Qué descargar y dónde ponerlo

Todo va suelto en `analiticas/`. El nombre del archivo da igual —el parser
reconoce las tablas por sus columnas, no por el nombre— así que los "(1)", "(2)"
y los acentos que Google mete no estorban. Conviene sí poner el mes delante
(`2026-09-adquisicion.csv`) para no confundirse al acumular periodos.

Lo mínimo útil es el bloque de GA4. Search Console es lo que explica *por qué*
el orgánico está donde está, y sin él el informe puede describir el tráfico pero
no diagnosticar la búsqueda.

## Google Analytics 4

En cada informe: arriba a la derecha, **fijar el periodo** (mes completo) y
luego el icono de **compartir → Descargar archivo → CSV**.

| Qué | Dónde en GA4 | Para qué sirve en el informe |
|---|---|---|
| Adquisición de tráfico | Informes → Adquisición → Adquisición de tráfico | Canales: de dónde llega la gente (sección 2) |
| Páginas y pantallas | Informes → Interacción → Páginas y pantallas | Qué ven y cuánto se quedan (sección 3) |
| Eventos | Informes → Interacción → Eventos | Qué hacen, y si `generate_lead` llega (secciones 4 y 7) |
| Datos demográficos | Informes → Usuario → Detalles demográficos | Ciudad y país: si el tráfico es de Chihuahua o no |
| Tecnología | Informes → Usuario → Detalles técnicos | Móvil vs escritorio |

**Para el desglose de los contactos** —saber si llegan por WhatsApp o por el
formulario, y desde qué sección— hace falta el Explorador, porque el informe
estándar de eventos no abre los parámetros:

Explorar → Exploración libre → dimensiones `Nombre del evento`, `method`,
`where` → métrica `Recuento de eventos` → filtrar `Nombre del evento =
generate_lead` → exportar CSV.

Si `method` y `where` no aparecen en la lista de dimensiones, es que no están
registradas como **dimensiones personalizadas**: Administrar → Definiciones
personalizadas → Crear dimensión personalizada, ámbito Evento, parámetro
`method` (y otra para `where`). GA4 solo las recoge desde que se crean, no
retroactivamente — por eso conviene crearlas cuanto antes aunque todavía no se
usen.

## Search Console

Rendimiento → Resultados de búsqueda → fijar periodo → **Exportar → CSV**.
Baja un ZIP; descomprimirlo y dejar los CSV sueltos en `analiticas/`. Los que
importan son `Consultas.csv`, `Páginas.csv` y `Fechas.csv`.

De Indexación → Páginas se puede exportar la cobertura (es lo que ya hay en la
carpeta: el gráfico de indexadas/sin indexar y la tabla de motivos). Sirve para
la sección 6 cuando hay páginas que no entran al índice.

## Comprobar antes de analizar

- **Que el periodo sea el mismo en todos los archivos.** Mezclar un GA4 de
  septiembre con un Search Console de agosto produce un informe coherente en
  apariencia y equivocado en el fondo. El script imprime el periodo que detectó;
  si no cuadra con lo que pidió el usuario, parar y avisar.
- **Que no haya filtro de comparación activo en GA4** al exportar. Si lo hay, el
  CSV trae las dos columnas y los totales quedan al doble.
