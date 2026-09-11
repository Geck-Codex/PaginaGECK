# assets-src

Originales de los que salen imágenes publicadas. **No se despliega**: vive fuera
de `public/` a propósito, porque lo que se sube al sitio es la versión ya
compuesta y optimizada, no el archivo de 1.6 MB que salió del generador.

## blog/

Fondos generados con IA para las portadas del blog. El prompt y los sujetos de
cada artículo están en
`.claude/skills/escribir-articulo/references/voz-y-plantilla.md`.

Para recomponer una portada con su fondo:

```
node scripts/generate-blog-cover.mjs <slug> --bg assets-src/blog/<archivo>.png --force
```

Se guardan aquí y no se borran porque si algún día cambia el título del
artículo, hay que rehacer la portada — y sin el original habría que regenerar la
imagen desde cero y saldría distinta.
