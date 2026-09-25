#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
configurar_ga4.py — deja la propiedad de GA4 configurada para medir contactos.

Que configura
-------------
1. `generate_lead` como **evento clave**, para que GA4 lo cuente como conversion
   y no como un evento mas. Sin esto el panel muestra cientos de eventos y cero
   conversiones, y es facil concluir que la web no convierte cuando lo unico que
   falta es este interruptor.
2. Las **dimensiones personalizadas** `method` y `where`. El sitio ya manda esos
   parametros en cada `generate_lead` (ver `src/data/track.js`), pero GA4 los
   descarta si no estan declaradas. Son las que despues permiten saber si los
   contactos llegan por WhatsApp o por el formulario, y desde que seccion.

GA4 **no aplica esto retroactivamente**: las dimensiones empiezan a recoger
datos el dia que se crean. De ahi que convenga correrlo cuanto antes aunque
todavia no se usen.

Uso
---
    python configurar_ga4.py                 # solo muestra que haria
    python configurar_ga4.py --aplicar       # lo hace

Por defecto no escribe nada. Esto toca la configuracion de un sistema de
produccion que guarda datos que no se pueden regenerar, asi que conviene ver el
plan antes de ejecutarlo. Es idempotente: lo que ya existe se deja como esta.

Requisitos
----------
- Admin API habilitada (`analyticsadmin.googleapis.com`).
- La cuenta de servicio con rol **Editor** en la propiedad. Con Lector, la API
  responde 403 al crear: leer configuracion y escribirla son permisos distintos.
- `GOOGLE_APPLICATION_CREDENTIALS` apuntando al JSON de la cuenta.
"""

from __future__ import annotations

import argparse
import os
import sys

PROPERTY_POR_DEFECTO = "550698809"

# El evento que emite `trackLead()`. Si algun dia el sitio emite otro evento de
# contacto, agregarlo aqui y no en un comando suelto: el objetivo es que la
# configuracion de GA4 se pueda reconstruir leyendo este archivo.
EVENTOS_CLAVE = ["generate_lead"]

# parametro -> nombre visible en los informes de GA4.
DIMENSIONES = {
    "method": ("Metodo de contacto", "Por donde llego el contacto: whatsapp, email o form."),
    "where": ("Origen del contacto", "Desde que seccion del sitio: footer, services o contact."),
}


def main() -> int:
    ap = argparse.ArgumentParser(description="Configura eventos clave y dimensiones en GA4")
    ap.add_argument("--property", default=PROPERTY_POR_DEFECTO)
    ap.add_argument("--aplicar", action="store_true", help="ejecutar los cambios (si no, solo los muestra)")
    args = ap.parse_args()

    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        print("Falta GOOGLE_APPLICATION_CREDENTIALS apuntando al JSON de la cuenta de servicio.")
        return 1

    try:
        # Cliente y tipos del MISMO modulo v1beta a proposito. `google.analytics.admin`
        # exporta el cliente v1alpha, y pasarle tipos de v1beta falla con un
        # "Failed to set field ..." que parece un problema de permisos y no lo es.
        from google.analytics.admin_v1beta import AnalyticsAdminServiceClient
        from google.analytics.admin_v1beta.types import CustomDimension, KeyEvent
    except ImportError:
        print("Falta la libreria: pip install google-analytics-admin")
        return 1

    cliente = AnalyticsAdminServiceClient()
    padre = f"properties/{args.property}"
    modo = "APLICANDO" if args.aplicar else "SIMULACION (usar --aplicar para ejecutar)"
    print(f"Propiedad {args.property} — {modo}\n")

    pendientes = 0   # lo que falta por hacer
    hechos = 0       # lo que se escribio de verdad
    fallos = 0

    # ── Eventos clave ────────────────────────────────────────────────────
    try:
        existentes = {k.event_name for k in cliente.list_key_events(parent=padre)}
    except Exception as e:  # noqa: BLE001
        print(f"No se pudieron listar los eventos clave: {str(e).splitlines()[0]}")
        return 1

    print("Eventos clave")
    for nombre in EVENTOS_CLAVE:
        if nombre in existentes:
            print(f"  = {nombre}: ya estaba marcado")
            continue
        pendientes += 1
        if not args.aplicar:
            print(f"  + {nombre}: se marcaria como evento clave")
            continue
        try:
            # ONCE_PER_SESSION y no ONCE_PER_EVENT: interesa cuanta GENTE
            # contacto, no cuantos clics hizo. Alguien que escribe por WhatsApp
            # y ademas manda el formulario en la misma visita es un lead, no dos.
            cliente.create_key_event(
                parent=padre,
                key_event=KeyEvent(
                    event_name=nombre,
                    counting_method=KeyEvent.CountingMethod.ONCE_PER_SESSION,
                ),
            )
            hechos += 1
            print(f"  + {nombre}: marcado como evento clave")
        except Exception as e:  # noqa: BLE001
            fallos += 1
            print(f"  ! {nombre}: fallo — {str(e).splitlines()[0]}")

    # ── Dimensiones personalizadas ───────────────────────────────────────
    try:
        ya = {d.parameter_name for d in cliente.list_custom_dimensions(parent=padre)}
    except Exception as e:  # noqa: BLE001
        print(f"\nNo se pudieron listar las dimensiones: {str(e).splitlines()[0]}")
        return 1

    print("\nDimensiones personalizadas")
    for parametro, (visible, descripcion) in DIMENSIONES.items():
        if parametro in ya:
            print(f"  = {parametro}: ya existia")
            continue
        pendientes += 1
        if not args.aplicar:
            print(f"  + {parametro}: se crearia como «{visible}»")
            continue
        try:
            cliente.create_custom_dimension(
                parent=padre,
                custom_dimension=CustomDimension(
                    parameter_name=parametro,
                    display_name=visible,
                    description=descripcion,
                    scope=CustomDimension.DimensionScope.EVENT,
                ),
            )
            hechos += 1
            print(f"  + {parametro}: creada como «{visible}»")
        except Exception as e:  # noqa: BLE001
            fallos += 1
            print(f"  ! {parametro}: fallo — {str(e).splitlines()[0]}")

    print()
    if not pendientes:
        print("Todo estaba configurado; no habia nada que hacer.")
    elif not args.aplicar:
        print(f"{pendientes} cambio(s) pendientes. Correr de nuevo con --aplicar.")
    else:
        if hechos:
            print(f"{hechos} cambio(s) aplicados. Las dimensiones recogen datos desde AHORA, "
                  "no hacia atras: los contactos anteriores no tendran method ni where.")
        if fallos:
            print(f"{fallos} fallaron y NO se aplicaron. Un 403 significa que la cuenta de "
                  "servicio sigue como Lector y necesita Editor.")
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
