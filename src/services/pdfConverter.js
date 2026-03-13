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

const BACKEND_URL = 'http://localhost:8000';

/**
 * Extracts structured content from a PDF (paragraphs and tables).
 * For advanced analysis, we now proxy to the Python backend.
 */
export const extractTableFromPDF = async (file) => {
    // We send a lightweight probe or just return a mock "ready" state
    // because the actual heavy lifting is done during download now.
    return { type: 'ready', name: file.name, file: file };
};

/**
 * Converts a PDF into an Excel file via Python Backend.
 */
export const downloadAsExcel = async (blocks, fileName = 'converted_data.xlsx') => {
    const formData = new FormData();
    formData.append('file', blocks.file);

    try {
        const response = await fetch(`${BACKEND_URL}/convert/excel`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Error en el servidor de conversión.');
        
        const blob = await response.blob();
        saveAs(blob, fileName);
    } catch (err) {
        console.error('Excel export failed:', err);
        throw err;
    }
};

/**
 * Converts PDF into a professional Word document via Python Backend.
 */
export const downloadAsWord = async (blocks, fileName = 'converted_data.docx') => {
    const formData = new FormData();
    formData.append('file', blocks.file);

    try {
        const response = await fetch(`${BACKEND_URL}/convert/word`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Error en el servidor de conversión de Word.');

        const blob = await response.blob();
        saveAs(blob, fileName);
    } catch (err) {
        console.error('Word export failed:', err);
        throw err;
    }
};

export const formatDataForSheets = (data) => data;
