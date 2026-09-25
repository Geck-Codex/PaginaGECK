#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
utm.py — genera los enlaces etiquetados que se pegan a mano en WhatsApp,
Instagram y demas, y escribe la chuleta en `analiticas/enlaces-utm.md`.

Por que hace falta un script para algo tan simple
------------------------------------------------
Pegar `?utm_source=whatsapp` no tiene ciencia. Lo que si tiene consecuencias es
la **coherencia**: GA4 trata `whatsapp`, `WhatsApp` y `wa` como tres fuentes
distintas, asi que un dia de descuido parte en tres lo que deberia ser una sola
linea del informe, y ya no hay forma de volver a juntarlas. Generandolos aqui,
el nombre siempre sale igual.

Los UTM van en los enlaces que APUNTAN al sitio (los que se pegan en un chat o
en una bio), nunca en los `wa.me` que salen del sitio: esos son salida, y quien
los pulsa ya esta medido por `trackLead()`.

Uso
---
    python utm.py                      # regenera analiticas/enlaces-utm.md
    python utm.py --source tiktok --medium bio --campaign lanzamiento
"""

from __future__ import annotations

import argparse
import re
import unicodedata
from datetime import date
from pathlib import Path
from urllib.parse import urlencode

SITIO = "https://geckcodex.com"
LF = chr(10)

# Destinos que se comparten de verdad. Mandar siempre a la home desperdicia el
# clic: si la conversacion iba de precios, el enlace deberia abrir /servicios/.
DESTINOS = [
    ("/", "Portada"),
    ("/servicios/", "Servicios y precios"),
    ("/portafolio/", "Portafolio"),
    ("/contacto/", "Contacto"),
    ("/servicios/ecosistema/", "Ecosistema"),
    ("/servicios/a-medida/", "Software a medida"),
    ("/blog/", "Blog"),
]

# Los sitios donde el enlace vive PEGADO de forma permanente. Son tres porque
# en una bio cabe un enlace y nada mas: generar una matriz de canales por
# destinos produce decenas de enlaces que nadie va a usar, y el documento deja
# de servir como chuleta en cuanto hay que buscar dentro de el.
FIJOS = [
    ("instagram", "bio", "Instagram", "Editar perfil -> Sitio web"),
    ("facebook", "perfil", "Facebook", "Editar pagina -> Contacto -> Sitio web"),
    ("linkedin", "perfil", "LinkedIn", "Editar perfil/pagina -> Sitio web"),
]

# Lo que se pega a mano en una conversacion. Aqui si cambia el destino segun de
# que se hable, asi que se listan los tres que se mandan de verdad.
DESTINOS_CHAT = [
    ("/", "la portada"),
    ("/servicios/", "precios y paquetes"),
    ("/portafolio/", "trabajos anteriores"),
]


def slug(texto: str) -> str:
    """minusculas, sin acentos y sin espacios: GA4 distingue mayusculas."""
    t = unicodedata.normalize("NFD", texto).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def normaliza_ruta(ruta: str) -> str:
    """
    Acepta `servicios`, `/servicios/` o la URL entera y devuelve `/servicios/`.

    Git Bash en Windows reescribe los argumentos que empiezan por `/` como rutas
    del disco, asi que `--ruta /servicios/` llega convertido en
    `C:/Program Files/Git/servicios/` y el enlace sale roto sin que nada avise.
    Aqui se deshace ese estropicio y se acepta tambien la forma sin barra, que es
    la que conviene teclear en esa terminal.
    """
    r = (ruta or "/").strip()
    if SITIO in r:
        r = r.split(SITIO, 1)[1]
    r = re.sub(r"^[A-Za-z]:[\/].*?[\/]Git[\/]", "/", r)  # deshace el mangling de MSYS
    r = r.replace("\\", "/")
    if not r.startswith("/"):
        r = "/" + r
    if not r.endswith("/"):
        r += "/"
    return r


def enlace(ruta: str, source: str, medium: str, campaign: str | None = None) -> str:
    params = {"utm_source": slug(source), "utm_medium": slug(medium)}
    if campaign:
        params["utm_campaign"] = slug(campaign)
    return f"{SITIO}{normaliza_ruta(ruta)}?{urlencode(params)}"


def documento(campaign: str | None) -> str:
    p = [
        "# Enlaces etiquetados (UTM)",
        "",
        f"_Generado por `scripts/utm.py` el {date.today().isoformat()}._",
        "",
        "Sin etiquetar, casi todo el trafico social cae en \"Direct\" y el informe no",
        "puede decir que lo trajo. Con estos enlaces, si.",
        "",
        "## Los tres que van pegados",
        "",
        "Se editan **una vez** y quedan midiendo para siempre.",
        "",
        "| Donde | Que pegar | Donde se edita |",
        "|---|---|---|",
    ]
    for source, medium, sitio, donde in FIJOS:
        p.append(f"| {sitio} | `{enlace('/', source, medium, campaign)}` | {donde} |")

    p += [
        "",
        "## Cuando mandas el enlace por chat",
        "",
        "Vale la pena mandar la pagina de la que se estaba hablando y no siempre la",
        "portada: quien pregunta por precios y aterriza en la home tiene que volver a",
        "buscarlos.",
        "",
        "| Para hablar de | Enlace |",
        "|---|---|",
    ]
    for ruta, para in DESTINOS_CHAT:
        p.append(f"| {para} | `{enlace(ruta, 'whatsapp', 'chat', campaign)}` |")

    p += [
        "",
        "## Cualquier otro",
        "",
        "```bash",
        "python .claude/skills/analizar-analiticas/scripts/utm.py \\",
        "    --source tiktok --medium bio --ruta servicios",
        "```",
        "",
        "Y para una promocion concreta, `--campaign navidad-2026` la agrupa por encima",
        "del canal y deja comparar el mismo empujon en Instagram y en WhatsApp.",
        "",
        "## Dos cosas que importan",
        "",
        "**Copiar tal cual.** GA4 trata `whatsapp` y `WhatsApp` como fuentes distintas,",
        "y una vez partida la cifra no se vuelve a juntar.",
        "",
        "**Nunca en los `wa.me` que salen del sitio.** Esos ya los mide `trackLead()`.",
        "",
        "Para comprobar que un enlace funciona sin esperar los 24-48 h del informe:",
        "abrirlo y mirar GA4 -> Informes -> Tiempo real.",
        "",
    ]
    return LF.join(p)


def main() -> int:
    ap = argparse.ArgumentParser(description="Genera enlaces con UTM")
    ap.add_argument("--source", help="generar un solo enlace: de donde sale")
    ap.add_argument("--medium", help="generar un solo enlace: como llega")
    ap.add_argument("--campaign", default=None)
    ap.add_argument("--ruta", default="/", help="destino, p.ej. servicios (sin barra inicial en Git Bash)")
    ap.add_argument("--salida", default="analiticas/enlaces-utm.md")
    args = ap.parse_args()

    if args.source and args.medium:
        print(enlace(args.ruta, args.source, args.medium, args.campaign))
        return 0

    destino = Path(args.salida)
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(documento(args.campaign), encoding="utf-8")
    print(f"chuleta -> {destino}")
    print(f"{len(FIJOS)} enlaces fijos + {len(DESTINOS_CHAT)} para chat")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
