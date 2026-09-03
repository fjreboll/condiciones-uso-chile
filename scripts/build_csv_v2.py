# -*- coding: utf-8 -*-
import csv
from new_vars import NEW_VARS, NEW_ROWS

NEW_COLUMNS = [
    "usa_recomendacion_algoritmica_declarada",
    "posibilidad_opt_out_personalizacion",
    "menciona_ia_generativa",
    "uso_declarado_ia_generativa",
    "version_localizada_chile",
    "gobernanza_moderacion_comportamiento",
    "datos_conductuales_para_personalizacion",
    "regula_trabajo_creadores_o_relacional",
    "menciona_bienestar_o_uso_saludable",
    "url_fuente_adicional",
    "notas_ampliacion",
]

# 1. Leer el CSV existente (18 plataformas, 19 columnas)
with open("condiciones_de_uso_chile.csv", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    base_columns = reader.fieldnames
    rows = list(reader)

assert len(rows) == 18, f"esperaba 18 filas base, encontre {len(rows)}"

# 2. Fusionar las 9 variables nuevas + 2 columnas de fuente/nota en cada fila existente
missing = []
for row in rows:
    plat = row["plataforma"]
    if plat not in NEW_VARS:
        missing.append(plat)
        continue
    row.update(NEW_VARS[plat])

if missing:
    raise SystemExit(f"Plataformas sin variables nuevas: {missing}")

# 3. Agregar las 2 filas nuevas (YouTube, Spotify) con id consecutivo
next_id = len(rows) + 1
for new_row in NEW_ROWS:
    full_row = {col: new_row.get(col, "") for col in base_columns + NEW_COLUMNS}
    full_row["id"] = next_id
    next_id += 1
    rows.append(full_row)

# 4. Escribir el CSV ampliado
all_columns = base_columns + NEW_COLUMNS
with open("condiciones_de_uso_chile_v2.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(f, fieldnames=all_columns, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    for row in rows:
        writer.writerow({col: row.get(col, "") for col in all_columns})

print(f"Filas totales: {len(rows)}")
print(f"Columnas totales: {len(all_columns)}")
