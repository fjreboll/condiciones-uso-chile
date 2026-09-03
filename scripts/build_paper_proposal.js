const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Header, Footer, PageNumber, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, VerticalAlign
} = require("docx");

const FONT = "Georgia";
const ACCENT = "1F3864";
const ACCENT2 = "2E5395";

function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 24, ...opts.run })],
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { after: 220, line: 350, ...opts.spacing },
    indent: opts.indent,
  });
}

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 420, after: 200 },
  });
}

function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 140 },
  });
}

function italic(text, opts = {}) {
  return p(text, { run: { italics: true, ...opts.run }, ...opts });
}

function bold(text, opts = {}) {
  return p(text, { run: { bold: true, ...opts.run }, ...opts });
}

function refLine(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 21 })],
    spacing: { after: 160, line: 280 },
    indent: { left: 720, hanging: 720 },
  });
}

// ---------- content ----------

const children = [];

// Title block
children.push(new Paragraph({
  children: [new TextRun({ text: "De la base de datos al paper", bold: true, size: 32, font: FONT })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
}));
children.push(new Paragraph({
  children: [new TextRun({
    text: "Propuesta de resumen extendido y estructura de artículo para el número especial “Algorithmic Sociality” de Convergence (SAGE)",
    bold: true, italics: true, size: 26, font: FONT, color: "444444",
  })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 480 },
}));

children.push(h1("1. Nota metodológica"));
children.push(p("Este documento traduce la base de datos ampliada de Términos de Servicio (20 plataformas, 30 variables) en un resumen extendido listo para adaptar y enviar a la convocatoria “Algorithmic Sociality: Platforms, Connection, and the Reconfiguration of Digital Relations” de Convergence (SAGE), cuyo plazo de resúmenes vence el 1 de octubre de 2026. El argumento que se propone no fuerza los datos hacia el eje del call: emergió directamente de las nueve variables nuevas investigadas para esta ampliación, en particular del cruce entre “versión localizada para Chile” y “uso declarado de recomendación algorítmica”, que produjo una separación empírica inusualmente limpia entre dos tipos de plataforma."));
children.push(p("El resumen extendido está escrito en inglés, como exige la convocatoria, y sigue exactamente el formato que pide el llamado: pregunta de investigación, argumento, marco teórico, metodología y contribución, en aproximadamente 500 palabras más referencias. Está pensado como borrador de trabajo — antes de enviarlo conviene revisar autoría, afiliación institucional y ajustar cualquier matiz que el proceso de escritura del capítulo de tesis haya precisado entre tanto."));

children.push(h1("2. Extended Abstract (borrador listo para adaptar)"));

const abstractParas = fs.readFileSync("abstract_en.txt", "utf-8").split("\n\n");
// abstractParas[0] = title, then body paragraphs, then Keywords line, then References block

children.push(new Paragraph({
  children: [new TextRun({ text: abstractParas[0], bold: true, size: 25, font: FONT })],
  spacing: { after: 240 },
  alignment: AlignmentType.LEFT,
}));

for (let i = 1; i < abstractParas.length; i++) {
  const block = abstractParas[i].trim();
  if (!block) continue;
  if (block.startsWith("Keywords:")) {
    children.push(p(block, { run: { italics: true }, spacing: { after: 200 } }));
  } else if (block.startsWith("References")) {
    children.push(new Paragraph({
      children: [new TextRun({ text: "References", bold: true, size: 24, font: FONT })],
      spacing: { before: 100, after: 160 },
    }));
    // the heading and the reference lines arrive as one block (single \n, not \n\n)
    const refLines = block.split("\n").slice(1).filter((l) => l.trim());
    refLines.forEach((line) => children.push(refLine(line)));
  } else if (block.match(/^(boyd|Gillespie|Star|Suzor|Van Dijck)/)) {
    // reference lines, one per remaining line
    block.split("\n").forEach((line) => children.push(refLine(line)));
  } else {
    children.push(p(block));
  }
}

children.push(h1("3. Biografía de autor/a (plantilla — completar antes de enviar)"));
children.push(p("La convocatoria pide una biografía de ~100 palabras por autor/a. No se completa aquí con datos no confirmados; se deja la plantilla para editar directamente:", { run: { italics: true } }));
children.push(new Paragraph({
  children: [new TextRun({
    text: "[Nombre] es [rol/título — ej. estudiante de magíster/doctorado, investigador/a independiente, diseñador/a] en [institución], donde investiga [líneas de investigación: diseño especulativo, humanidades digitales, gobernanza de plataformas, protección de datos]. Su proyecto actual construye una base de datos comparada de condiciones de uso de plataformas digitales en Chile para analizar críticamente la relación entre diseño de interfaz, infraestructura contractual y sociality algorítmica. Contacto: [correo].",
    font: FONT, size: 24, italics: true,
  })],
  spacing: { after: 300, line: 350 },
  indent: { left: 400 },
  border: { left: { style: BorderStyle.SINGLE, size: 12, color: "AAAAAA", space: 8 } },
}));

children.push(h1("4. Evidencia empírica clave"));
children.push(p("La tabla resume el hallazgo central: ninguna de las nueve plataformas de redes sociales, mensajería, streaming o servicios generales del corpus mantiene una versión de sus términos jurisdiccionalmente localizada para Chile, mientras que las once plataformas transaccionales de la muestra —comercio electrónico, delivery, banca y servicios de gobierno— sí la tienen. La separación es total: cero excepciones en 20 casos."));

const tableHeaderCells = ["Categoría", "N", "¿Localizada para Chile?", "Ejemplos"].map((t) =>
  new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: "FFFFFF", font: FONT, size: 20 })] })],
    shading: { type: ShadingType.CLEAR, fill: ACCENT },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
  })
);

const tableRows = [
  ["Redes sociales y mensajería", "5", "No (4) / Parcial (1)", "Facebook, Instagram, WhatsApp, TikTok, X"],
  ["Streaming y servicios generales", "4", "No especifica (1) / Parcial (3)", "Netflix, YouTube, Spotify, Google"],
  ["E-commerce y delivery", "4", "Sí (4)", "Mercado Libre, Falabella, Uber, Rappi"],
  ["Banca", "4", "Sí (4)", "Santander, Banco de Chile, BCI, BancoEstado"],
  ["Gobierno y salud", "3", "Sí (3)", "ClaveÚnica/ChileAtiende, SII, Fonasa"],
].map((row) =>
  new TableRow({
    children: row.map((cell, idx) =>
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: cell, font: FONT, size: 20 })] })],
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        shading: idx === 2 ? { type: ShadingType.CLEAR, fill: "F2F2F2" } : undefined,
      })
    ),
  })
);

children.push(new Table({
  width: { size: 9350, type: WidthType.DXA },
  columnWidths: [2600, 500, 2750, 3500],
  rows: [new TableRow({ children: tableHeaderCells }), ...tableRows],
}));

children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
children.push(p("Otros dos patrones respaldan el argumento: (a) solo 1 de las 20 plataformas (Uber/Uber Eats) ofrece algo codificable como opt-out completo de personalización — la respuesta modal (15 de 20) es control parcial, casi siempre limitado a publicidad y no al motor de recomendación; y (b) 17 de 20 plataformas ya declaran uso de IA generativa, incluyendo 3 de los 4 bancos estudiados y el SII, lo que sugiere que la lógica contractual de la “sociality algorítmica” se está extendiendo más allá de las redes sociales hacia las relaciones estatales y financieras."));

children.push(h1("5. Propuesta de estructura del paper completo (manuscrito final, marzo 2027)"));
children.push(p("Estructura pensada para una revista de humanidades digitales/media studies, con extensión típica de 7.000-9.000 palabras. Los títulos de sección se dan en inglés (formato de envío); la descripción, en español, es para planificación interna."));

const sections = [
  ["1. Introduction", "Presenta el problema: la sociality algorítmica tiene una capa contractual poco estudiada. Plantea la pregunta de investigación y adelanta el hallazgo de la asimetría de localización."],
  ["2. Theoretical Framework: Contracts as Sociotechnical Infrastructure", "Desarrolla en extenso el marco ya construido para la tesis — STS (Latour, Star, Gillespie, Suzor, Zuboff), humanidades digitales (Manovich, Moretti), artes mediales (arqueología de medios, arte de datos) y diseño especulativo (Dunne & Raby, con la salvedad decolonial de Escobar) — y lo articula específicamente con la literatura de “networked publics” (boyd, 2010) y sociality algorítmica que define este número especial."],
  ["3. Regulatory Context: Chile Between Ley 19.628 and Ley 21.719", "Sitúa el caso chileno: transición regulatoria en curso (nueva Agencia de Protección de Datos, vigencia plena en diciembre de 2026) y lo que eso implica para leer el corpus como un corte sincrónico en un momento de cambio normativo."],
  ["4. Methodology: Building a Comparative ToS Corpus", "Describe la construcción del corpus (20 plataformas, 5 sectores, 30 variables, vocabulario controlado), el proceso de codificación, y discute honestamente las limitaciones: bloqueos por robots.txt en Meta/TikTok/LinkedIn, inaccesibilidad reiterada de BancoEstado, y la distinción metodológica entre lo declarado en el ToS mismo y lo declarado en documentación no contractual (páginas de ayuda, centros de transparencia)."],
  ["5. Findings", "Tres subsecciones, una por hallazgo: (5.1) la asimetría de localización jurídica; (5.2) la ilusión del opt-out (control de publicidad vs. control de la curación); (5.3) la difusión de la IA generativa más allá de las redes sociales, hacia banca y administración tributaria."],
  ["6. Discussion: Extending Algorithmic Sociality Beyond Social Media", "Argumenta que el concepto de sociality algorítmica, tal como lo plantea la convocatoria, debería extenderse a relaciones Estado-ciudadanía y banco-cliente, no solo a redes sociales; y que la localización jurídica es en sí misma una señal relacional — un indicador contractual de a quién una plataforma considera necesario rendirle cuentas."],
  ["7. Conclusion", "Cierra retomando la contribución al eje Norte/Sur del call: Chile como caso de estudio de “soberanía regulatoria asíncrona” frente a plataformas globales, y agenda de investigación futura (verificación manual de las políticas bloqueadas, ampliación comparativa a otros países de la región)."],
  ["References", "Bibliografía completa combinando las referencias del marco teórico de tesis ya construido con la literatura específica de platform studies y sociality algorítmica citada en el resumen extendido."],
];

sections.forEach(([title, desc]) => {
  children.push(new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 23, font: FONT, color: ACCENT2 })],
    spacing: { before: 220, after: 80 },
  }));
  children.push(p(desc, { spacing: { after: 160 } }));
});

children.push(h1("6. Próximos pasos sugeridos"));
children.push(p("Antes del 1 de octubre de 2026: decidir autoría y afiliación para completar la biografía; considerar si vale la pena verificar manualmente (navegador, no automatizado) las políticas que bloquearon el acceso automatizado — Meta, TikTok, LinkedIn y especialmente BancoEstado y ChileAtiende, cuyos datos hoy dependen de fuentes secundarias; y revisar si el marco teórico de tesis ya escrito (diseño especulativo, artes mediales, humanidades digitales, STS) necesita algún ajuste de énfasis para funcionar como Sección 2 del paper completo, dado que este resumen extendido ya asume esa base."));

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 28, bold: true, color: ACCENT }, paragraph: { spacing: { before: 400, after: 200 }, keepNext: true } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 25, bold: true, color: ACCENT2 }, paragraph: { spacing: { before: 300, after: 140 }, keepNext: true } },
    ],
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Propuesta de paper — Algorithmic Sociality (Convergence)", size: 16, color: "888888", font: FONT })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, font: FONT, color: "888888" })],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Propuesta_paper_algorithmic_sociality.docx", buffer);
  console.log("done");
});
