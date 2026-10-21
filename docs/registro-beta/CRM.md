# Cómo jala el CRM los registros de la beta de Ganova

Los registros del formulario de geckcodex.com/ganova viven en el Supabase de
Ganova, esquema `beta`. Ahí Carlos los revisa y escoge (`decision`, `notas`).
El CRM no entra a esa base: le pregunta cada rato qué cambió y se copia lo nuevo.

## La llamada

```http
POST https://voigbndxjzphuttdcula.supabase.co/rest/v1/rpc/crm_registros_beta
apikey: <llave pública (anon) de Supabase>
Authorization: Bearer <la misma llave pública>
x-crm-llave: <la llave del CRM, empieza con gnv_crm_>
Content-Type: application/json

{ "desde": null, "limite": 100 }
```

- La **llave pública** es la misma que usa la página; Carlos te la pasa.
- La **llave del CRM** es secreta y es solo tuya. Carlos la crea en Supabase
  y te la da una vez. No va en el navegador ni en el repo: va en las variables
  de entorno del servidor del CRM.
- `limite`: de 1 a 500. Si no lo mandas, son 100.

## La respuesta

```json
{ "datos": [ ... ], "siguiente": "MjAyNi0x...", "hay_mas": false }
```

Ejemplo completo en `crm-respuesta.ejemplo.json`. Cada elemento de `datos` es
una de dos cosas:

1. **Un registro**, nuevo o que cambió. Trae todo: contacto, ubicación,
   perfil, consentimiento, origen y además `decision` y `notas`, que pone
   Carlos. Guárdalo con su `id`: si ya lo tenías, **reemplázalo completo**.
2. **Una baja**: solo trae `id`, `actualizado_en` y `eliminado_en` (no es
   null). La persona pidió que borraran sus datos: **bórrala de tu base**, no
   la escondas. Es obligación por ley (LFPDPPP art. 24).

Para saber cuál es cuál: `eliminado_en` es `null` en un registro y trae fecha
en una baja.

## El ciclo

1. La primera vez manda `"desde": null`: te llega todo desde el principio.
2. Guarda el `siguiente` que te contestó, en tu base, junto con los registros
   que recibiste.
3. La siguiente vez manda `"desde": "<ese siguiente>"`.
4. Si `hay_mas` es `true`, pide otra vez luego luego. Si es `false`, espera
   unos minutos (cada 5 está bien).
5. Si no hubo nada nuevo, `datos` llega vacío y `siguiente` es el mismo que mandaste.

`siguiente` no se interpreta: guárdalo y regrésalo tal cual. Lo que cambió en
los últimos 5 segundos sale en la vuelta siguiente, a propósito, para no
saltarse nada que se esté guardando.

## Valores de cada campo

Las opciones llegan como código. Qué significa cada uno está en
`registro.schema.json`. `decision` puede ser `pendiente`, `escogido`,
`en_espera` o `descartado`.

## Errores

| Respuesta | Qué pasó |
|---|---|
| 401 / 403 con `llave_invalida` | Falta `x-crm-llave`, está mal o la revocaron. Pídele una nueva a Carlos. |
| 400 con `cursor_invalido` | El `desde` no es un `siguiente` que te hayamos dado. Manda `null` para empezar de nuevo. |
| 5xx | Falla del servidor. Reintenta en unos minutos con el mismo `desde`; no se pierde nada. |
