const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageOrientation, PageNumber, Footer, Header, Table, TableRow, TableCell,
  WidthType, BorderStyle
} = require("docx");

const raw = fs.readFileSync("contenido.md", "utf-8");
const lines = raw.split("\n");

// Parse a line's inline markdown (*italic*) into TextRun[]
function parseInline(text, baseOpts = {}) {
  const runs = [];
  const parts = text.split(/(\*[^*]+\*)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
      runs.push(new TextRun({ text: part.slice(1, -1), italics: true, ...baseOpts }));
    } else {
      runs.push(new TextRun({ text: part, ...baseOpts }));
    }
  }
  return runs.length ? runs : [new TextRun({ text: "", ...baseOpts })];
}

const FONT = "Georgia";
const children = [];

let inReferences = false;
let titleDone = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line === "") continue;

  if (line.startsWith("# Referencias")) {
    inReferences = true;
    children.push(new Paragraph({
      text: "Referencias",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 480, after: 240 },
      pageBreakBefore: true,
    }));
    continue;
  }

  if (!titleDone && line.startsWith("# ") ) {
    // Main title (first H1 before section 1)
    children.push(new Paragraph({
      children: parseInline(line.replace(/^# /, ""), { bold: true, size: 32, font: FONT }),
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }));
    continue;
  }

  if (!titleDone && line.startsWith("## ")) {
    children.push(new Paragraph({
      children: parseInline(line.replace(/^## /, ""), { bold: true, italics: true, size: 26, font: FONT, color: "444444" }),
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 },
    }));
    titleDone = true;
    continue;
  }

  if (line.match(/^# \d+\./)) {
    children.push(new Paragraph({
      text: line.replace(/^# /, ""),
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }));
    continue;
  }

  if (line.match(/^## \d+\.\d+/)) {
    children.push(new Paragraph({
      text: line.replace(/^## /, ""),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 160 },
    }));
    continue;
  }

  if (inReferences) {
    children.push(new Paragraph({
      children: parseInline(line, { size: 22, font: FONT }),
      spacing: { after: 200, line: 276 },
      indent: { left: 720, hanging: 720 },
      alignment: AlignmentType.LEFT,
    }));
    continue;
  }

  // Regular body paragraph
  children.push(new Paragraph({
    children: parseInline(line, { size: 24, font: FONT }),
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 240, line: 360 },
    indent: { firstLine: 480 },
  }));
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: FONT, size: 24 } },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: FONT, size: 28, bold: true, color: "1F3864" },
        paragraph: { spacing: { before: 400, after: 200 }, keepNext: true },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: FONT, size: 25, bold: true, color: "2E5395" },
        paragraph: { spacing: { before: 300, after: 160 }, keepNext: true },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 }, // US Letter
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Marco teórico — Repositorio de Condiciones de Uso",
                  size: 16,
                  color: "888888",
                  font: FONT,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: [PageNumber.CURRENT], size: 18, font: FONT, color: "888888" }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Marco_teorico_condiciones_de_uso.docx", buffer);
  console.log("done");
});
