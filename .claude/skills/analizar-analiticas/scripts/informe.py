#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
informe.py — arma el esqueleto del informe mensual a partir de `dataset.json`.

Reparto de trabajo
------------------
Este script hace lo que una maquina hace mejor: sumar, dividir, ordenar, y
comparar contra el informe del periodo anterior. Escribe las tablas ya
calculadas y deja marcadores `<!-- ESCRIBIR: ... -->` donde hace falta criterio.

Lo que NO hace es interpretar. Un numero sin lectura no sirve de nada, y una
lectura inventada por una plantilla sirve menos todavia. Esa parte la escribe
Claude leyendo el informe y el contexto del negocio.

La comparacion mes contra mes sale del frontmatter del informe anterior, no de
volver a parsear sus tablas: el frontmatter es un contrato estable y las tablas
cambian de forma cada vez que se agrega una dimension.

Uso
---
    python informe.py --dataset analiticas/.cache/dataset.json \
                      --salida analiticas/informes
"""

from __future__ import annotations

import argparse
import itertools
import json
import re
from datetime import date
from pathlib import Path

# Metricas que viajan en el frontmatter para que el informe siguiente compare.
COMPARABLES = [
    ("sesiones", "Sesiones"),
    ("usuarios", "Usuarios"),
    ("vistas", "Vistas de pagina"),
    ("eventos", "Eventos"),
    ("eventos_clave", "Eventos clave"),
    ("leads", "Leads (generate_lead)"),
    ("tasa_interaccion_pct", "Tasa de interaccion %"),
    ("conversion_sesion_lead_pct", "Conversion sesion->lead %"),
    ("gsc_clics", "Clics en Google"),
    ("gsc_impresiones", "Impresiones en Google"),
]


def aplanar(dataset: dict) -> dict[str, float]:
    """Saca de las derivadas el puñado de cifras que se comparan entre periodos."""
    d = dataset.get("derivadas", {})
    plano: dict[str, float] = dict(d.get("totales", {}))
    for k in ("leads", "tasa_interaccion_pct", "conversion_sesion_lead_pct"):
        if d.get(k) is not None:
            plano[k] = d[k]
    for k, v in (d.get("gsc_totales") or {}).items():
        plano[f"gsc_{k}"] = v
    return plano


def informe_anterior(carpeta: Path, nombre_actual: str) -> tuple[str | None, dict]:
    """Devuelve (nombre, metricas) del informe mas reciente distinto del actual."""
    previos = sorted(
        p for p in carpeta.glob("informe-*.md") if p.name != nombre_actual
    )
    if not previos:
        return None, {}

    ultimo = previos[-1]
    texto = ultimo.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---", texto, re.S)
    if not m:
        return ultimo.name, {}

    metricas: dict[str, float] = {}
    dentro = False
    for linea in m.group(1).splitlines():
        if linea.strip() == "metricas:":
            dentro = True
            continue
        if dentro:
            if not linea.startswith("  "):
                break
            if ":" in linea:
                k, v = linea.strip().split(":", 1)
                try:
                    metricas[k.strip()] = float(v.strip())
                except ValueError:
                    pass
    return ultimo.name, metricas


def fmt(n) -> str:
    if n is None:
        return "—"
    if isinstance(n, float) and not n.is_integer():
        return f"{n:,.2f}".replace(",", " ")
    return f"{int(n):,}".replace(",", " ")


def delta(actual, previo) -> str:
    """Variacion frente al periodo anterior, en absoluto y en porcentaje."""
    if previo is None or actual is None:
        return "—"
    diff = actual - previo
    signo = "+" if diff > 0 else ""
    if previo == 0:
        return f"{signo}{fmt(diff)} (nuevo)"
    return f"{signo}{fmt(diff)} ({signo}{diff / previo * 100:.0f} %)"


def tabla(encabezados: list[str], filas: list[list[str]]) -> str:
    if not filas:
        return "_Sin datos para este periodo._\n"
    out = ["| " + " | ".join(encabezados) + " |",
           "|" + "|".join(["---"] * len(encabezados)) + "|"]
    out += ["| " + " | ".join(f) + " |" for f in filas]
    return "\n".join(out) + "\n"


def construir(dataset: dict, prev_nombre: str | None, prev: dict) -> str:
    d = dataset.get("derivadas", {})
    ga4, gsc = dataset.get("ga4", {}), dataset.get("gsc", {})
    periodo = dataset.get("periodo", {})
    plano = aplanar(dataset)

    ini, fin = periodo.get("inicio", "?"), periodo.get("fin", "?")
    p = [f"---",
         f"periodo_inicio: {ini}",
         f"periodo_fin: {fin}",
         f"generado: {date.today().isoformat()}",
         f"comparado_con: {prev_nombre or 'ninguno'}",
         "metricas:"]
    for k, _ in COMPARABLES:
        if plano.get(k) is not None:
            p.append(f"  {k}: {plano[k]}")
    p += ["---", "", f"# Analitica — {ini} a {fin}", ""]

    p += ["<!-- ESCRIBIR: resumen. Tres o cuatro frases, sin adornos: que paso en",
          "     el periodo, si mejoro o empeoro respecto al anterior, y cual es la",
          "     unica cosa que conviene hacer antes del proximo informe. Si un dato",
          "     no esta medido, decirlo aqui en vez de dar por buena una suposicion. -->", ""]

    # Numerar a mano se rompe en cuanto una seccion se omite por falta de
    # datos, y un informe que salta del 5 al 7 hace dudar de si falta algo.
    n = itertools.count(1)
    sec = lambda titulo: f"## {next(n)}. {titulo}"

    # ── Cifras
    p += [sec("Las cifras"), ""]
    filas = []
    for k, etiqueta in COMPARABLES:
        if plano.get(k) is None:
            continue
        filas.append([etiqueta, fmt(plano[k]), fmt(prev.get(k)), delta(plano[k], prev.get(k))])
    p.append(tabla(["Metrica", "Este periodo", "Anterior", "Variacion"], filas))

    # ── Canales
    if d.get("canales_pct"):
        p += ["", sec("De donde llega la gente"), ""]
        p.append(tabla(
            ["Canal", "Sesiones", "% del total"],
            [[c["canal"], fmt(c["sesiones"]), f"{c['pct']:.1f} %" if c["pct"] is not None else "—"]
             for c in d["canales_pct"]],
        ))
        p += ["<!-- ESCRIBIR: lectura de los canales. Un 'Directo' muy alto casi nunca",
              "     es gente tecleando la URL: suele ser trafico de WhatsApp, de apps o",
              "     de campanas sin UTM, y eso significa que no se sabe que lo trajo.",
              "     Decir que canal esta creciendo, cual no existe, y que hacer. -->", ""]

    # ── Paginas
    if ga4.get("paginas"):
        top = sorted(
            (f for f in ga4["paginas"] if not f.get("_total")),
            key=lambda f: f.get("vistas", 0), reverse=True,
        )[:12]
        p += ["", sec("Que paginas ven"), ""]
        p.append(tabla(
            ["Pagina", "Vistas", "Usuarios", "Tiempo medio"],
            [[str(f.get("pagina", "—")), fmt(f.get("vistas")), fmt(f.get("usuarios")),
              f"{int(f['duracion_media'] // 60)}:{int(f['duracion_media'] % 60):02d}"
              if f.get("duracion_media") else "—"]
             for f in top],
        ))
        p += ["<!-- ESCRIBIR: que dice el recorrido. Interesa sobre todo la distancia",
              "     entre la home y /contacto/ o /servicios/: si mucha gente entra y casi",
              "     nadie llega a contacto, el problema no es el trafico. -->", ""]

    # ── Eventos
    if ga4.get("eventos"):
        ev = sorted(
            (f for f in ga4["eventos"] if not f.get("_total")),
            key=lambda f: f.get("eventos", 0), reverse=True,
        )
        p += ["", sec("Que hacen"), ""]
        p.append(tabla(
            ["Evento", "Recuento", "Eventos clave"],
            [[str(f.get("evento", "—")), fmt(f.get("eventos")), fmt(f.get("eventos_clave"))] for f in ev],
        ))

    # ── Embudo
    p += ["", sec("El embudo"), ""]
    t = d.get("totales", {})
    escalones = [
        ("Sesiones", t.get("sesiones")),
        ("Sesiones con interaccion", t.get("sesiones_con_interaccion")),
        ("Contactos (generate_lead)", d.get("leads")),
    ]
    base = escalones[0][1]
    p.append(tabla(
        ["Escalon", "Cantidad", "% de las sesiones"],
        [[n, fmt(v), f"{v / base * 100:.1f} %" if base and v is not None else "—"]
         for n, v in escalones],
    ))
    p += ["", "<!-- ESCRIBIR: donde se cae la gente y por que. El salto que importa es",
          "     el ultimo: cuantas visitas terminan en un contacto real. Si los leads",
          "     son cero, primero verificar que el evento este llegando (seccion 7)",
          "     antes de concluir que la web no convierte. -->", ""]
    p += ["<!-- ESCRIBIR: cuantos de esos contactos se volvieron clientes y cuanto",
          "     facturaron. Ese dato NO esta en GA4 — lo pone el usuario. Si no lo dio,",
          "     dejar la pregunta escrita aqui en lugar de omitir el escalon: un embudo",
          "     que termina en 'leads' no dice si la web produce dinero. -->", ""]

    # ── Google
    if d.get("gsc_totales") or gsc.get("consultas") or d.get("indexacion"):
        p += ["", sec("Busqueda en Google"), ""]
        g = d.get("gsc_totales", {})
        if g:
            p.append(tabla(
                ["Metrica", "Valor"],
                [["Clics", fmt(g.get("clics"))],
                 ["Impresiones", fmt(g.get("impresiones"))],
                 ["CTR", f"{g['ctr_pct']:.2f} %" if g.get("ctr_pct") else "—"]],
            ))
        if gsc.get("consultas"):
            top = sorted(
                (f for f in gsc["consultas"] if not f.get("_total")),
                key=lambda f: f.get("impresiones", 0), reverse=True,
            )[:15]
            p += ["", "**Consultas**", ""]
            p.append(tabla(
                ["Consulta", "Clics", "Impresiones", "Posicion"],
                [[str(f.get("consulta", "—")), fmt(f.get("clics")), fmt(f.get("impresiones")),
                  f"{f['posicion']:.1f}" if f.get("posicion") else "—"] for f in top],
            ))
        if d.get("indexacion"):
            i = d["indexacion"]
            p += ["", f"**Indexacion al {i.get('fecha', '?')}:** "
                  f"{fmt(i.get('indexadas'))} indexadas, {fmt(i.get('sin_indexar'))} sin indexar.", ""]
        p += ["<!-- ESCRIBIR: que busquedas traen gente y cuales aparecen pero no se",
              "     clican. Separar las de marca ('geck codex') de las que no lo son: solo",
              "     las segundas son crecimiento. Si hay paginas sin indexar, decir",
              "     cuales y desde cuando. -->", ""]

    # ── Tracking
    p += ["", sec("Estado de la medicion"), "",
          "<!-- ESCRIBIR: resultado del diagnostico de tracking (ver la parte",
          "     correspondiente en SKILL.md). Que eventos deberian estar llegando segun",
          "     el codigo, cuales aparecen de verdad en GA4, y que CTA esta sin medir.",
          "     Un informe que no avisa de un agujero de medicion hace tomar decisiones",
          "     con datos incompletos sin que nadie lo sepa. -->", ""]

    # ── Acciones
    p += ["", sec("Que hacer ahora"), "",
          "<!-- ESCRIBIR: entre tres y cinco acciones concretas, ordenadas por lo que",
          "     mas mueve la aguja. Cada una dice que se hace, donde (archivo o pantalla",
          "     de GA4) y que numero de este informe deberia cambiar si funciona. Nada",
          "     de 'mejorar el SEO' — eso no es una accion. -->", ""]

    # ── Procedencia
    p += ["", "---", "", "## Procedencia de los datos", ""]
    p.append(tabla(
        ["Archivo", "Tablas reconocidas"],
        [[f["archivo"], str(f["tablas"])] for f in dataset.get("fuentes", [])],
    ))
    if dataset.get("avisos"):
        p += ["", "**Avisos de la ingesta:**", ""]
        p += [f"- {a}" for a in dataset["avisos"]]
        p += [""]

    return "\n".join(p)


def main() -> int:
    ap = argparse.ArgumentParser(description="Genera el esqueleto del informe mensual")
    ap.add_argument("--dataset", default="analiticas/.cache/dataset.json")
    ap.add_argument("--salida", default="analiticas/informes")
    ap.add_argument("--nombre", default=None, help="nombre del archivo (por defecto informe-<periodo>.md)")
    args = ap.parse_args()

    ruta = Path(args.dataset)
    if not ruta.is_file():
        print(f"No existe {ruta}. Correr antes ingest.py.")
        return 1
    dataset = json.loads(ruta.read_text(encoding="utf-8"))

    carpeta = Path(args.salida)
    carpeta.mkdir(parents=True, exist_ok=True)

    fin = dataset.get("periodo", {}).get("fin") or date.today().isoformat()
    nombre = args.nombre or f"informe-{fin[:7]}.md"
    prev_nombre, prev = informe_anterior(carpeta, nombre)

    destino = carpeta / nombre
    destino.write_text(construir(dataset, prev_nombre, prev), encoding="utf-8")

    print(f"informe -> {destino}")
    print(f"comparado con: {prev_nombre or 'ninguno (es el primero)'}")
    pendientes = destino.read_text(encoding="utf-8").count("<!-- ESCRIBIR")
    print(f"secciones por redactar: {pendientes}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
