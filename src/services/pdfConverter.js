import * as pdfjs from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle,
  AlignmentType,
  VerticalAlign
} from 'docx';
import { saveAs } from 'file-saver';

// Initialize PDF.js worker correctly for Vite
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts structured content from a PDF (paragraphs and tables).
 * @param {File} file - The PDF file to process.
 * @returns {Promise<Array<Object>>} - Array of content blocks.
 */
export const extractTableFromPDF = async (file) => {
    console.log('[PDF] Advanced Processing:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let blocks = []; // { type: 'text'|'table', data: [rows] }

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items;

        if (items.length === 0) continue;

        // 1. Group by Y coordinate with tolerance
        const tolerance = 4; 
        let rawRows = {};
        items.forEach(item => {
            const y = Math.round(item.transform[5] / tolerance) * tolerance;
            if (!rawRows[y]) rawRows[y] = [];
            rawRows[y].push(item);
        });

        const sortedY = Object.keys(rawRows).sort((a, b) => b - a);
        
        // 2. Analyze rows to distinguish text from tables
        let currentPageRows = sortedY.map(y => {
            const rowItems = rawRows[y].sort((a, b) => a.transform[4] - b.transform[4]);
            return {
                y: parseFloat(y),
                items: rowItems,
                text: rowItems.map(it => it.str).join(' ').trim(),
                isTableCandidate: rowItems.length > 1 && hasSignificantGaps(rowItems)
            };
        });

        // 3. Cluster consecutive table rows
        let currentBlock = null;
        currentPageRows.forEach(row => {
            if (row.isTableCandidate) {
                if (!currentBlock || currentBlock.type !== 'table') {
                    currentBlock = { type: 'table', rows: [] };
                    blocks.push(currentBlock);
                }
                // Determine columns for this row (basic heuristic)
                currentBlock.rows.push(row.items.map(it => it.str));
            } else {
                if (row.text.length > 0) {
                    blocks.push({ type: 'text', content: row.text });
                    currentBlock = null;
                }
            }
        });
    }

    // Return the matrix format for Excel fallback, or the blocks for Word
    // We add a meta-property for PDFConverter.vue to know it's detailed
    blocks.isStructured = true;
    return blocks;
};

// Helper: Detect large gaps between text items in a line
function hasSignificantGaps(items) {
    if (items.length < 2) return false;
    for (let i = 0; i < items.length - 1; i++) {
        const gap = items[i+1].transform[4] - (items[i].transform[4] + items[i].width);
        if (gap > 35) return true; // Threshold for a "column gap"
    }
    return false;
}

/**
 * Converts a 2D array of data into an Excel file.
 * We flatten the structured blocks for Excel compatibility.
 */
export const downloadAsExcel = (blocks, fileName = 'converted_data.xlsx') => {
    let flatData = [];
    if (blocks.isStructured) {
        blocks.forEach(block => {
            if (block.type === 'table') {
                flatData.push(...block.rows);
            } else {
                flatData.push([block.content]);
            }
        });
    } else {
        flatData = blocks;
    }

    const ws = XLSX.utils.aoa_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nexora AI Export");
    XLSX.writeFile(wb, fileName);
};

/**
 * Converts PDF blocks into a professional Word document with REAL TABLES.
 */
export const downloadAsWord = async (blocks, fileName = 'converted_data.docx') => {
    const children = [];

    blocks.forEach(block => {
        if (block.type === 'text') {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: block.content, size: 22, font: "Inter" })],
                    spacing: { after: 200 }
                })
            );
        } else if (block.type === 'table') {
            // Determine max columns
            const maxCols = Math.max(...block.rows.map(r => r.length));
            
            const table = new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: block.rows.map(row => {
                    return new TableRow({
                        children: row.map(cellText => {
                            return new TableCell({
                                children: [new Paragraph({ 
                                    children: [new TextRun({ text: cellText, size: 20, font: "Inter" })],
                                    alignment: AlignmentType.LEFT
                                })],
                                verticalAlign: VerticalAlign.CENTER,
                                margins: { top: 100, bottom: 100, left: 100, right: 100 },
                                border: {
                                    top: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                                    left: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                                    right: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                                }
                            });
                        })
                    });
                }),
                spacing: { after: 300 }
            });
            children.push(table);
        }
    });

    const doc = new Document({
        sections: [{ properties: {}, children }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
};

export const formatDataForSheets = (data) => data;
