# Condiciones de uso digitales en Chile

Repositorio de datos y visualizaciones sobre las condiciones de uso (Terms of Service) de 20 plataformas digitales de uso masivo en Chile, construido para el proyecto **"Agentes de especulación"** — un cruce entre diseño especulativo, artes mediales, humanidades digitales y estudios de ciencia, tecnología y sociedad (STS).

**Dashboard interactivo:** publicado con GitHub Pages en este mismo repositorio (ver la pestaña *About* o `Settings → Pages` para la URL una vez activado).

## Qué hay acá

- **`index.html`** — dashboard interactivo (KPIs, gráficos y tabla explorable de las 20 plataformas × 30 variables).
- **`documentos.html`** — página de descargas con los documentos del proyecto.
- **`data/condiciones_de_uso_chile.csv`** — el dataset completo: naturaleza pública/privada, exposición y protección de datos personales, y variables de "sociality algorítmica" (recomendación, opt-out de personalización, IA generativa, localización jurídica para Chile, gobernanza de moderación, entre otras).
- **`docs/`** — el marco teórico (capítulo extenso, APA 7), la propuesta de extended abstract + estructura de paper para el número especial *"Algorithmic Sociality"* de *Convergence* (SAGE), y el análisis crítico de esa convocatoria.
- **`scripts/`** — los scripts Python/Node usados para construir el CSV y los documentos Word a partir de la investigación.

## Hallazgo central

La localización jurídica de los términos de servicio sigue al modelo de negocio, no al volumen de usuarios: **0 de 9** plataformas de redes sociales, mensajería, streaming y servicios generales mantienen una versión de sus términos redactada específicamente para Chile, mientras que **11 de 11** plataformas transaccionales (comercio electrónico, delivery, banca, gobierno) sí la tienen.

## Método

Los datos provienen de lectura directa de los documentos legales publicados por cada plataforma, consultados entre agosto y septiembre de 2026 — antes de la entrada en vigencia plena de la Ley 21.719 (nueva ley de protección de datos personales de Chile, diciembre de 2026). Donde el documento no permite determinar un valor con certeza, se registra como `no_especifica` en lugar de inferirlo. Las limitaciones de acceso (bloqueos por robots.txt, errores 404/403) están documentadas en las columnas `notas` y `notas_ampliacion` del CSV.
