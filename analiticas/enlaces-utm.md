# Enlaces etiquetados (UTM)

_Generado por `scripts/utm.py` el 2026-09-18._

Sin etiquetar, casi todo el trafico social cae en "Direct" y el informe no
puede decir que lo trajo. Con estos enlaces, si.

## Los tres que van pegados

Se editan **una vez** y quedan midiendo para siempre.

| Donde | Que pegar | Donde se edita |
|---|---|---|
| Instagram | `https://geckcodex.com/?utm_source=instagram&utm_medium=bio` | Editar perfil -> Sitio web |
| Facebook | `https://geckcodex.com/?utm_source=facebook&utm_medium=perfil` | Editar pagina -> Contacto -> Sitio web |
| LinkedIn | `https://geckcodex.com/?utm_source=linkedin&utm_medium=perfil` | Editar perfil/pagina -> Sitio web |

## Cuando mandas el enlace por chat

Vale la pena mandar la pagina de la que se estaba hablando y no siempre la
portada: quien pregunta por precios y aterriza en la home tiene que volver a
buscarlos.

| Para hablar de | Enlace |
|---|---|
| la portada | `https://geckcodex.com/?utm_source=whatsapp&utm_medium=chat` |
| precios y paquetes | `https://geckcodex.com/servicios/?utm_source=whatsapp&utm_medium=chat` |
| trabajos anteriores | `https://geckcodex.com/portafolio/?utm_source=whatsapp&utm_medium=chat` |

## Cualquier otro

```bash
python .claude/skills/analizar-analiticas/scripts/utm.py \
    --source tiktok --medium bio --ruta servicios
```

Y para una promocion concreta, `--campaign navidad-2026` la agrupa por encima
del canal y deja comparar el mismo empujon en Instagram y en WhatsApp.

## Dos cosas que importan

**Copiar tal cual.** GA4 trata `whatsapp` y `WhatsApp` como fuentes distintas,
y una vez partida la cifra no se vuelve a juntar.

**Nunca en los `wa.me` que salen del sitio.** Esos ya los mide `trackLead()`.

Para comprobar que un enlace funciona sin esperar los 24-48 h del informe:
abrirlo y mirar GA4 -> Informes -> Tiempo real.
