import * as pdfjs from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Extracts text content from a PDF and attempts to group it into a table structure.
 * @param {File} file - The PDF file to process.
 * @returns {Promise<Array<Array<string>>>} - A 2D array representing the table data.
 */
export const extractTableFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let allRows = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items;

        // Group items by Y coordinate (row)
        // Note: PDF coordinates start from bottom-left
        const tolerance = 5; // Pixels of vertical tolerance for same row
        let rows = {};

        items.forEach(item => {
            const y = Math.round(item.transform[5] / tolerance) * tolerance;
            if (!rows[y]) rows[y] = [];
            rows[y].push(item);
        });

        // Sort rows by Y (descending) and items within rows by X (ascending)
        const sortedY = Object.keys(rows).sort((a, b) => b - a);

        sortedY.forEach(y => {
            const rowItems = rows[y].sort((a, b) => a.transform[4] - b.transform[4]);
            allRows.push(rowItems.map(item => item.str));
        });
    }

    return allRows;
};

/**
 * Converts a 2D array of data into an Excel file and triggers download.
 * @param {Array<Array<string>>} data - The 2D array of data.
 * @param {string} fileName - The desired file name.
 */
export const downloadAsExcel = (data, fileName = 'converted_data.xlsx') => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PDF Data");
    XLSX.writeFile(wb, fileName);
};

/**
 * Converts PDF text items into a Word document and triggers download.
 * @param {Array<Array<string>>} data - The 2D array of data (rows and text items).
 * @param {string} fileName - The desired file name.
 */
export const downloadAsWord = async (data, fileName = 'converted_data.docx') => {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: data.map(row => {
                    return new Paragraph({
                        children: [
                            new TextRun({
                                text: row.join('    '), // Basic spacing between columns
                                size: 24, // 12pt
                                font: "Inter"
                            }),
                        ],
                        spacing: {
                            after: 200,
                        }
                    });
                }),
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
};

/**
 * Formats the data for Google Sheets sync.
 * @param {Array<Array<string>>} data - The 2D array of data.
 * @returns {Array<Object>} - Array of rows as objects or arrays for Sheets sync.
 */
export const formatDataForSheets = (data) => {
    // For now, we return it as is or handle headers
    return data;
};
