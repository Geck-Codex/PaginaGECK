#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ingest.py — convierte los CSV crudos de GA4 y Search Console en un dataset
normalizado (`dataset.json`) que el informe consume.

Por que existe esta capa
------------------------
El analisis no deberia saber de donde salieron los numeros. Hoy salen de CSV
que el usuario descarga a mano; manana pueden salir de la GA4 Data API. Si el
analisis leyera los CSV directamente, cambiar de fuente obligaria a reescribirlo
entero. Aqui la fuente se elige con `--backend` y el resto del mundo solo ve el
JSON normalizado, que tiene la misma forma venga de donde venga.

Uso
---
    python ingest.py --dir analiticas                      # CSV de la carpeta
    python ingest.py --backend ga4api --mes 2026-09        # GA4 en vivo
    python ingest.py --backend ga4api --inicio 2026-09-01 --fin 2026-09-15

El backend `ga4api` necesita la credencial de la cuenta de servicio en
`GOOGLE_APPLICATION_CREDENTIALS` y trae solo GA4: Search Console no tiene
backend de API y sus CSV se siguen dejando en `analiticas/`. Cuando hagan falta
las dos fuentes, correr los dos backends a distinto `--out` y analizarlos
juntos. El alta de credenciales esta en `references/api-ga4.md`.

Tolerancia
----------
Los CSV de GA4 y de Search Console cambian de nombre, de idioma y de formato de
numero segun quien los descargue. Por eso nada se detecta por el nombre del
archivo: todo se detecta por los encabezados de columna, normalizados sin
acentos y en minusculas. Un archivo que no se reconoce no rompe la corrida — se
apunta en `avisos` y se sigue, porque perder un informe entero por un CSV raro
seria peor que entregarlo incompleto y avisado.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import unicodedata
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

# ──────────────────────────────────────────────────────────────────────────
#  Utilidades de normalizacion
# ──────────────────────────────────────────────────────────────────────────


def sin_acentos(texto: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", texto) if unicodedata.category(c) != "Mn"
    )


def clave(texto: str) -> str:
    """Encabezado -> clave comparable: sin acentos, minusculas, sin ruido."""
    t = sin_acentos(str(texto or "")).lower().strip()
    t = t.replace("﻿", "")
    t = re.sub(r"[^a-z0-9]+", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def parse_num(valor) -> float | None:
    """
    Convierte un numero de GA4/GSC a float.

    Los exports vienen con el formato del locale de quien los baja: '1.234,5'
    en espanol, '1,234.5' en ingles, '61,25 %', '00:01:23' para duraciones.
    Adivinar mal el separador decimal convierte 1.234 sesiones en 1,2 — el tipo
    de error que pasa desapercibido en un informe. De ahi el cuidado.
    """
    if valor is None:
        return None
    if isinstance(valor, (int, float)):
        return float(valor)

    s = str(valor).strip().replace(" ", " ")
    if not s or s in {"-", "—", "N/D", "n/a", "N/A"}:
        return None

    # Duracion mm:ss o hh:mm:ss -> segundos
    if re.fullmatch(r"\d{1,2}:\d{2}(:\d{2})?", s):
        partes = [int(p) for p in s.split(":")]
        while len(partes) < 3:
            partes.insert(0, 0)
        return partes[0] * 3600 + partes[1] * 60 + partes[2]

    porcentaje = "%" in s
    s = s.replace("%", "").replace("$", "").replace("MXN", "").strip()

    tiene_coma, tiene_punto = "," in s, "." in s
    if tiene_coma and tiene_punto:
        # El ultimo separador que aparece es el decimal.
        decimal = "," if s.rfind(",") > s.rfind(".") else "."
        miles = "." if decimal == "," else ","
        s = s.replace(miles, "").replace(decimal, ".")
    elif tiene_coma:
        # Una sola coma con 1-2 decimales es decimal; '1,234' son miles.
        s = s.replace(",", "." if re.fullmatch(r"-?\d+,\d{1,2}", s) else "")
    elif tiene_punto:
        if re.fullmatch(r"-?\d{1,3}(\.\d{3})+", s):
            s = s.replace(".", "")

    try:
        n = float(s)
    except ValueError:
        return None
    return n / 100 if porcentaje and n > 1 else n


def parse_fecha(valor) -> str | None:
    """Devuelve ISO 'YYYY-MM-DD' a partir de los formatos que usan los exports."""
    s = str(valor or "").strip()
    if re.fullmatch(r"\d{8}", s):
        return f"{s[:4]}-{s[4:6]}-{s[6:]}"
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(s, fmt).date().isoformat()
        except ValueError:
            continue
    return None


# ──────────────────────────────────────────────────────────────────────────
#  Diccionario de metricas y dimensiones (es / en / pt)
# ──────────────────────────────────────────────────────────────────────────

METRICAS = {
    "usuarios": ["usuarios", "usuarios activos", "total de usuarios", "users", "active users", "total users", "usuarios totales"],
    "usuarios_nuevos": ["usuarios nuevos", "nuevos usuarios", "new users"],
    "sesiones": ["sesiones", "sessions"],
    "sesiones_con_interaccion": ["sesiones con interaccion", "sesiones interactivas", "engaged sessions"],
    "tasa_interaccion": ["tasa de interaccion", "porcentaje de interacciones", "engagement rate"],
    "tasa_rebote": ["porcentaje de rebote", "tasa de rebote", "bounce rate"],
    "duracion_media": ["duracion media de la interaccion", "tiempo de interaccion medio", "duracion media de la sesion", "average engagement time", "average session duration", "tiempo de interaccion medio por sesion"],
    "vistas": ["vistas", "vistas de pagina", "visualizaciones", "views", "page views", "screen page views", "vistas de pantalla o pagina"],
    "eventos": ["recuento de eventos", "numero de eventos", "event count", "eventos"],
    "eventos_clave": ["eventos clave", "key events", "conversiones", "conversions"],
    "ingresos": ["ingresos totales", "ingresos", "total revenue", "revenue"],
    # Search Console
    "clics": ["clics", "clicks"],
    "impresiones": ["impresiones", "impressions"],
    "ctr": ["ctr", "ctr promedio", "average ctr"],
    "posicion": ["posicion", "posicion media", "average position", "posicion promedio"],
    # Cobertura de indexacion
    "indexadas": ["indexadas", "indexed"],
    "sin_indexar": ["sin indexar", "not indexed"],
    "paginas": ["paginas", "pages"],
}

DIMENSIONES = {
    "canal": ["canal predeterminado de grupo", "grupo de canales predeterminado", "canal predeterminado del grupo", "session default channel group", "session default channel grouping", "default channel group", "primer canal predeterminado de grupo del usuario"],
    "fuente_medio": ["fuente medio de la sesion", "fuente medio", "session source medium", "source medium"],
    "campania": ["campana de la sesion", "campana", "session campaign", "campaign"],
    "pagina": ["ruta de pagina y clase de pantalla", "ruta de la pagina", "pagina", "titulo de la pagina y clase de pantalla", "page path and screen class", "page path", "landing page", "pagina de destino", "paginas principales", "url", "direccion url"],
    "evento": ["nombre del evento", "event name"],
    "dispositivo": ["categoria de dispositivo", "dispositivo", "device category", "device"],
    "pais": ["pais", "country"],
    "ciudad": ["ciudad", "city"],
    "consulta": ["consulta", "consultas principales", "query", "top queries", "busqueda"],
    "fecha": ["fecha", "date", "nesima fecha", "n esima fecha"],
    "metodo": ["metodo", "method"],
    "origen_lead": ["where", "desde donde", "seccion"],
}


def mapear(encabezados: list[str]) -> tuple[dict[int, str], dict[int, str]]:
    """Devuelve (indice -> dimension, indice -> metrica) para una fila de encabezados."""
    dims: dict[int, str] = {}
    mets: dict[int, str] = {}
    for i, h in enumerate(encabezados):
        k = clave(h)
        if not k:
            continue
        for nombre, alias in DIMENSIONES.items():
            if k in alias:
                dims[i] = nombre
                break
        else:
            for nombre, alias in METRICAS.items():
                if k in alias:
                    mets[i] = nombre
                    break
    return dims, mets


# ──────────────────────────────────────────────────────────────────────────
#  Lectura de archivos
# ──────────────────────────────────────────────────────────────────────────


def leer_texto(ruta: Path) -> str:
    for enc in ("utf-8-sig", "utf-16", "latin-1"):
        try:
            return ruta.read_text(encoding=enc)
        except (UnicodeDecodeError, UnicodeError):
            continue
    return ruta.read_text(encoding="utf-8", errors="replace")


def detectar_delimitador(muestra: str) -> str:
    try:
        return csv.Sniffer().sniff(muestra, delimiters=",;\t").delimiter
    except csv.Error:
        return max(",;\t", key=muestra.count)


def bloques(texto: str) -> tuple[list[list[list[str]]], dict]:
    """
    Parte un CSV de GA4 en bloques tabulares y extrae el periodo de los
    comentarios `#` de cabecera.

    GA4 mete varias tablas en un mismo archivo, separadas por lineas en blanco,
    y antepone metadatos comentados con '#'. Tratar el archivo como una sola
    tabla produce filas basura; por eso se corta por lineas vacias.
    """
    meta: dict = {}
    fechas: list[str] = []
    limpias: list[str] = []

    for linea in texto.splitlines():
        if linea.lstrip().startswith("#"):
            comentario = linea.lstrip("# ").strip()
            for token in re.findall(r"\d{8}|\d{4}-\d{2}-\d{2}", comentario):
                f = parse_fecha(token)
                if f:
                    fechas.append(f)
            if ":" in comentario:
                k, v = comentario.split(":", 1)
                meta.setdefault(clave(k), v.strip())
            continue
        limpias.append(linea)

    if fechas:
        meta["inicio"] = min(fechas)
        meta["fin"] = max(fechas)

    delim = detectar_delimitador("\n".join(limpias[:40]) or ",")
    grupos: list[list[list[str]]] = []
    actual: list[list[str]] = []
    for fila in csv.reader(io.StringIO("\n".join(limpias)), delimiter=delim):
        if not any(c.strip() for c in fila):
            if actual:
                grupos.append(actual)
                actual = []
            continue
        actual.append(fila)
    if actual:
        grupos.append(actual)

    return [g for g in grupos if len(g) >= 2], meta


def tabla(bloque: list[list[str]], origen: str) -> dict | None:
    """Convierte un bloque en {dimensiones, metricas, filas}."""
    encabezados = bloque[0]
    dims, mets = mapear(encabezados)
    if not mets:
        return None

    filas = []
    for cruda in bloque[1:]:
        if not any(c.strip() for c in cruda):
            continue
        fila: dict = {}
        for i, celda in enumerate(cruda):
            if i in dims:
                v = celda.strip()
                fila[dims[i]] = parse_fecha(v) if dims[i] == "fecha" and parse_fecha(v) else v
            elif i in mets:
                n = parse_num(celda)
                if n is not None:
                    fila[mets[i]] = n
        # GA4 cierra muchos bloques con una fila de totales, sin etiqueta o con
        # la palabra "Total". Hay que marcarla o todo se cuenta dos veces. Se
        # compara contra el texto crudo, no normalizado: la ruta de la home es
        # "/" y al normalizarla queda vacia, asi que la pagina mas visitada del
        # sitio se tomaria por un total y desapareceria de la suma.
        if fila:
            etiqueta = str(fila.get(next(iter(dims.values()), ""), "")).strip()
            fila["_total"] = bool(dims) and (
                etiqueta == "" or clave(etiqueta) in {"total", "totales", "totals"}
            )
            filas.append(fila)

    if not filas:
        return None
    return {
        "origen": origen,
        "dimensiones": sorted(set(dims.values())),
        "metricas": sorted(set(mets.values())),
        "filas": filas,
    }


# ──────────────────────────────────────────────────────────────────────────
#  Clasificacion y ensamblado
# ──────────────────────────────────────────────────────────────────────────

# Que seccion del dataset alimenta cada tabla, segun su dimension principal.
DESTINO = {
    "canal": ("ga4", "canales"),
    "fuente_medio": ("ga4", "fuentes"),
    "campania": ("ga4", "campanias"),
    "evento": ("ga4", "eventos"),
    "dispositivo": ("ga4", "dispositivos"),
    "pais": ("ga4", "paises"),
    "ciudad": ("ga4", "ciudades"),
    "consulta": ("gsc", "consultas"),
}


def clasificar(t: dict) -> tuple[str, str]:
    dims, mets = set(t["dimensiones"]), set(t["metricas"])
    es_gsc = bool(mets & {"clics", "impresiones", "posicion"}) and not (mets & {"sesiones", "usuarios"})

    if "consulta" in dims:
        return "gsc", "consultas"
    if mets & {"indexadas", "sin_indexar"}:
        return "gsc", "indexacion"
    if "paginas" in mets and "sesiones" not in mets:
        return "gsc", "cobertura"
    if "pagina" in dims:
        return ("gsc", "paginas") if es_gsc else ("ga4", "paginas")
    if "fecha" in dims:
        return ("gsc", "serie") if es_gsc else ("ga4", "serie")
    for d in t["dimensiones"]:
        if d in DESTINO:
            return DESTINO[d]
    if es_gsc:
        return "gsc", "otros"
    return "ga4", "totales" if not dims else "otros"


def ingesta_csv(directorio: Path) -> dict:
    dataset: dict = {
        "generado": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "backend": "csv",
        "periodo": {},
        "fuentes": [],
        "ga4": {},
        "gsc": {},
        "avisos": [],
    }
    fechas: list[str] = []

    archivos = sorted(
        p for p in directorio.rglob("*")
        if p.suffix.lower() in {".csv", ".tsv"} and ".cache" not in p.parts and "informes" not in p.parts
    )
    if not archivos:
        dataset["avisos"].append(
            f"No hay ningun CSV en {directorio}. Ver references/ga4-exports.md para saber que descargar."
        )
        return dataset

    for ruta in archivos:
        rel = str(ruta.relative_to(directorio))
        try:
            grupos, meta = bloques(leer_texto(ruta))
        except Exception as e:  # noqa: BLE001 - un CSV corrupto no tumba el informe
            dataset["avisos"].append(f"No se pudo leer «{rel}»: {e}")
            continue

        if meta.get("inicio"):
            fechas += [meta["inicio"], meta["fin"]]

        reconocidas = 0
        for bloque_ in grupos:
            t = tabla(bloque_, rel)
            if not t:
                continue
            reconocidas += 1
            fuente, seccion = clasificar(t)
            dataset[fuente].setdefault(seccion, []).extend(t["filas"])
            for f in t["filas"]:
                if f.get("fecha"):
                    fechas.append(f["fecha"])

        dataset["fuentes"].append({"archivo": rel, "tablas": reconocidas, "periodo": meta or None})
        if not reconocidas:
            dataset["avisos"].append(
                f"«{rel}» no tiene ninguna columna reconocible (ni sesiones, ni clics, ni eventos). "
                "Si deberia contar, revisar el diccionario METRICAS/DIMENSIONES en ingest.py."
            )

    if fechas:
        dataset["periodo"] = {"inicio": min(fechas), "fin": max(fechas)}
    return dataset


# Traduccion de los nombres de la API a las claves normalizadas del dataset.
# Vive aqui, en el backend, para que el analisis nunca vea un `pagePath`: si los
# nombres de la fuente se filtraran al dataset, cambiar de fuente volveria a
# obligar a tocar el informe, que es justo lo que esta capa evita.
API_DIM = {
    "sessionDefaultChannelGroup": "canal",
    "sessionSourceMedium": "fuente_medio",
    "sessionCampaignName": "campania",
    "pagePath": "pagina",
    "eventName": "evento",
    "deviceCategory": "dispositivo",
    "country": "pais",
    "city": "ciudad",
    "date": "fecha",
    "customEvent:method": "metodo",
    "customEvent:where": "origen_lead",
}

API_MET = {
    "sessions": "sesiones",
    "activeUsers": "usuarios",
    "newUsers": "usuarios_nuevos",
    "engagedSessions": "sesiones_con_interaccion",
    "screenPageViews": "vistas",
    "eventCount": "eventos",
    "keyEvents": "eventos_clave",
    "userEngagementDuration": "_engagement_total",
}

# Cada entrada es una consulta. `clave` es la seccion del dataset que alimenta.
CONSULTAS = [
    ("canales", ["sessionDefaultChannelGroup"], ["sessions", "activeUsers", "engagedSessions"]),
    ("fuentes", ["sessionSourceMedium"], ["sessions", "activeUsers"]),
    ("paginas", ["pagePath"], ["screenPageViews", "activeUsers", "userEngagementDuration"]),
    ("eventos", ["eventName"], ["eventCount", "keyEvents"]),
    ("leads", ["eventName", "customEvent:method", "customEvent:where"], ["eventCount"]),
    ("dispositivos", ["deviceCategory"], ["sessions", "activeUsers"]),
    ("ciudades", ["city"], ["sessions", "activeUsers"]),
    ("paises", ["country"], ["sessions"]),
    ("serie", ["date"], ["sessions", "activeUsers", "engagedSessions"]),
]


def ingesta_api(property_id: str | None, inicio: str, fin: str) -> dict:
    """
    Trae los datos de la GA4 Data API y los deja con la misma forma que el
    backend de CSV. Ver references/api-ga4.md para el alta de credenciales.

    Cada consulta se aisla en su propio try: una propiedad sin dimensiones
    personalizadas hace fallar la consulta de leads, y seria absurdo perder el
    informe entero por eso. Lo que falla se anota en `avisos` y se sigue.
    """
    if not property_id:
        raise SystemExit(
            "Falta --property con el ID numerico de la propiedad (Administrar -> "
            "Detalles de la propiedad). No es el ID de medicion G-XXXXXXX."
        )

    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import (
            DateRange, Dimension, Metric, RunReportRequest,
        )
    except ImportError:
        raise SystemExit("Falta la libreria: pip install google-analytics-data")

    cliente = BetaAnalyticsDataClient()
    dataset: dict = {
        "generado": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "backend": "ga4api",
        "periodo": {"inicio": inicio, "fin": fin},
        "fuentes": [],
        "ga4": {},
        "gsc": {},
        "avisos": [],
    }

    for seccion, dims, mets in CONSULTAS:
        peticion = RunReportRequest(
            property=f"properties/{property_id}",
            date_ranges=[DateRange(start_date=inicio, end_date=fin)],
            dimensions=[Dimension(name=d) for d in dims],
            metrics=[Metric(name=m) for m in mets],
            limit=1000,
        )
        try:
            respuesta = cliente.run_report(peticion)
        except Exception as e:  # noqa: BLE001
            detalle = str(e).split("\n")[0][:200]
            dataset["avisos"].append(f"La consulta «{seccion}» fallo: {detalle}")
            continue

        filas = []
        for fila in respuesta.rows:
            registro: dict = {}
            for cabecera, valor in zip(respuesta.dimension_headers, fila.dimension_values):
                nombre = API_DIM.get(cabecera.name, cabecera.name)
                v = valor.value
                registro[nombre] = parse_fecha(v) or v if nombre == "fecha" else v
            for cabecera, valor in zip(respuesta.metric_headers, fila.metric_values):
                registro[API_MET.get(cabecera.name, cabecera.name)] = parse_num(valor.value) or 0

            # `userEngagementDuration` es el tiempo TOTAL en segundos, no la
            # media. Publicarlo como media exageraria el dato por el numero de
            # usuarios, asi que se divide aqui y el bruto no viaja al dataset.
            bruto = registro.pop("_engagement_total", None)
            if bruto is not None:
                usuarios = registro.get("usuarios") or 0
                registro["duracion_media"] = round(bruto / usuarios, 1) if usuarios else 0

            filas.append(registro)

        if seccion == "leads":
            # Solo interesan los contactos; el resto de eventos ya viene en su
            # propia seccion y aqui solo aportarian ruido.
            filas = [f for f in filas if clave(str(f.get("evento", ""))) == "generate lead"]

        dataset["ga4"][seccion] = filas
        dataset["fuentes"].append({
            "archivo": f"GA4 API · {seccion} ({'+'.join(dims)})",
            "tablas": 1 if filas else 0,
            "periodo": {"inicio": inicio, "fin": fin},
        })

    if not any(dataset["ga4"].values()):
        dataset["avisos"].append(
            "La API respondio sin datos. Comprobar que el ID de propiedad es el correcto "
            "y que la cuenta de servicio tiene acceso de Lector a esa propiedad."
        )

    dataset["avisos"].append(
        "Search Console no viene por esta via: sus CSV se siguen dejando en analiticas/."
    )
    return dataset


# ──────────────────────────────────────────────────────────────────────────
#  Derivadas
# ──────────────────────────────────────────────────────────────────────────


def suma(filas: list[dict], metrica: str) -> float:
    """Suma una metrica ignorando las filas que ya son un total del bloque."""
    return sum(f.get(metrica, 0) or 0 for f in filas if not f.get("_total"))


def derivar(dataset: dict) -> dict:
    """
    Calcula lo que siempre se pregunta: totales, reparto por canal y el embudo
    sesion -> interaccion -> lead.

    Se calcula aqui y no en el informe porque una division mal hecha a ojo es la
    forma mas facil de publicar un numero falso, y estos numeros se comparan mes
    contra mes.
    """
    ga4, gsc = dataset.get("ga4", {}), dataset.get("gsc", {})
    d: dict = {}

    base = ga4.get("canales") or ga4.get("dispositivos") or ga4.get("paises") or ga4.get("totales") or []
    totales = {
        m: round(suma(base, m), 2)
        for m in ("usuarios", "usuarios_nuevos", "sesiones", "sesiones_con_interaccion")
        if suma(base, m)
    }
    if ga4.get("eventos"):
        totales["eventos"] = round(suma(ga4["eventos"], "eventos"), 2)
        totales["eventos_clave"] = round(suma(ga4["eventos"], "eventos_clave"), 2)
    if ga4.get("paginas"):
        totales["vistas"] = round(suma(ga4["paginas"], "vistas"), 2)
    d["totales"] = totales

    if ga4.get("canales"):
        tot = suma(ga4["canales"], "sesiones") or suma(ga4["canales"], "usuarios")
        d["canales_pct"] = [
            {
                "canal": f.get("canal", "(sin nombre)"),
                "sesiones": f.get("sesiones", f.get("usuarios", 0)),
                "pct": round((f.get("sesiones", f.get("usuarios", 0)) / tot) * 100, 1) if tot else None,
            }
            for f in ga4["canales"] if not f.get("_total")
        ]
        d["canales_pct"].sort(key=lambda x: x["sesiones"], reverse=True)

    # Leads: los eventos que este sitio usa como contacto.
    leads = 0.0
    for f in ga4.get("eventos", []):
        if clave(str(f.get("evento", ""))) in {"generate lead", "contact", "conversion"}:
            leads += f.get("eventos", 0) or 0
    if leads:
        d["leads"] = round(leads, 2)

    sesiones = totales.get("sesiones") or 0
    if sesiones:
        if totales.get("sesiones_con_interaccion"):
            d["tasa_interaccion_pct"] = round(totales["sesiones_con_interaccion"] / sesiones * 100, 1)
        if leads:
            d["conversion_sesion_lead_pct"] = round(leads / sesiones * 100, 2)

    if gsc.get("consultas"):
        d["gsc_totales"] = {
            "clics": round(suma(gsc["consultas"], "clics"), 2),
            "impresiones": round(suma(gsc["consultas"], "impresiones"), 2),
        }
        imp = d["gsc_totales"]["impresiones"]
        if imp:
            d["gsc_totales"]["ctr_pct"] = round(d["gsc_totales"]["clics"] / imp * 100, 2)

    if gsc.get("indexacion"):
        ultima = max(
            (f for f in gsc["indexacion"] if f.get("fecha")),
            key=lambda f: f["fecha"],
            default=None,
        )
        if ultima:
            d["indexacion"] = ultima

    return d


# ──────────────────────────────────────────────────────────────────────────


# La propiedad de geckcodex.com. No es un secreto (el ID de medicion viaja en
# el HTML de todas las paginas), y fijarlo evita tener que recordarlo cada vez.
PROPERTY_POR_DEFECTO = "550698809"


def rango(mes: str | None, inicio: str | None, fin: str | None) -> tuple[str, str]:
    """
    Resuelve el periodo a consultar.

    Por defecto el mes calendario ANTERIOR completo, no los ultimos 30 dias:
    los informes son mensuales y se comparan entre si, y un periodo movil hace
    que dos informes consecutivos se solapen sin que se note al leerlos.
    """
    if inicio and fin:
        return inicio, fin
    if mes:
        y, m = (int(x) for x in mes.split("-"))
    else:
        hoy = date.today()
        y, m = (hoy.year - 1, 12) if hoy.month == 1 else (hoy.year, hoy.month - 1)
    ultimo = (date(y + (m == 12), (m % 12) + 1, 1) - timedelta(days=1)).day
    return f"{y:04d}-{m:02d}-01", f"{y:04d}-{m:02d}-{ultimo:02d}"


def main() -> int:
    ap = argparse.ArgumentParser(description="Normaliza los datos de analitica a dataset.json")
    ap.add_argument("--dir", default="analiticas", help="carpeta con los CSV crudos")
    ap.add_argument("--out", default=None, help="ruta del dataset.json (por defecto <dir>/.cache/dataset.json)")
    ap.add_argument("--backend", default="csv", choices=["csv", "ga4api"])
    ap.add_argument("--property", default=None, help="ID numerico de propiedad GA4 (backend ga4api)")
    ap.add_argument("--mes", default=None, help="atajo: YYYY-MM (mes calendario completo)")
    ap.add_argument("--inicio", default=None, help="YYYY-MM-DD")
    ap.add_argument("--fin", default=None, help="YYYY-MM-DD")
    args = ap.parse_args()

    directorio = Path(args.dir)
    if args.backend == "ga4api":
        inicio, fin = rango(args.mes, args.inicio, args.fin)
        dataset = ingesta_api(args.property or PROPERTY_POR_DEFECTO, inicio, fin)

        # Search Console no tiene backend de API, asi que su parte se toma de los
        # CSV de la carpeta y se injerta aqui. Sin esto haria falta generar dos
        # datasets y elegir cual alimenta el informe, y el que se quedara fuera
        # se echaria en falta justo en la seccion que lo necesita.
        if directorio.is_dir():
            csvs = ingesta_csv(directorio)
            dataset["gsc"] = csvs.get("gsc", {})
            dataset["fuentes"] += [f for f in csvs["fuentes"] if f["tablas"]]
            dataset["avisos"] += [a for a in csvs["avisos"] if "no tiene ninguna columna" not in a]
            if not dataset["gsc"]:
                dataset["avisos"].append(
                    f"Sin datos de Search Console en {directorio}: el informe no podra decir "
                    "que se busca en Google. Ver references/ga4-exports.md."
                )
    else:
        if not directorio.is_dir():
            print(f"No existe la carpeta {directorio}", file=sys.stderr)
            return 1
        dataset = ingesta_csv(directorio)

    dataset["derivadas"] = derivar(dataset)

    salida = Path(args.out) if args.out else directorio / ".cache" / "dataset.json"
    salida.parent.mkdir(parents=True, exist_ok=True)
    salida.write_text(json.dumps(dataset, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"dataset -> {salida}")
    print(f"periodo: {dataset['periodo'].get('inicio', '?')} a {dataset['periodo'].get('fin', '?')}")
    print(f"archivos leidos: {len(dataset['fuentes'])}")
    for seccion in ("ga4", "gsc"):
        for nombre, filas in sorted(dataset.get(seccion, {}).items()):
            print(f"  {seccion}.{nombre}: {len(filas)} filas")
    if dataset["derivadas"].get("totales"):
        print("totales:", json.dumps(dataset["derivadas"]["totales"], ensure_ascii=False))
    for aviso in dataset["avisos"]:
        print(f"  aviso: {aviso}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
