import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIntegrationsStore = defineStore('integrations', () => {
    const isGoogleConnected = ref(false)
    const connectedEmail = ref('')
    const spreadsheetUrl = ref('')
    const spreadsheetId = ref('')
    const connectionHook = ref('')
    const hookUrl = ref('')
    const spreadsheets = ref([])
    const activeSpreadsheet = ref(null)
    const isSyncing = ref(false)
    const connectionError = ref('')

    const setSpreadsheetUrl = (url) => {
        spreadsheetUrl.value = url.trim()
        connectionError.value = ''

        // Robust extraction: matches /d/ID or /d/e/ID
        const match = url.match(/\/d\/(?:e\/)?([a-zA-Z0-9-_]+)/)

        if (match) {
            const id = match[1]

            // Check for "Published to Web" prefix (2PACX-) which doesn't work with scripts
            if (id.startsWith('2PACX-')) {
                spreadsheetId.value = ''
                connectionError.value = 'URL NO VÁLIDA: Estás usando un enlace de "Publicar en la web". Por favor, usa la URL de la barra de direcciones mientras editas la hoja.'
                return
            }

            // DETECT XLSX (Excel IDs are usually 33 chars, native Sheets are 44)
            if (id.length < 40) {
                spreadsheetId.value = id
                connectionError.value = 'ARCHIVO EXCEL DETECTADO: El archivo es un ".xlsx". Nexora solo lee Hojas de Google nativas. Ve a Archivo > Guardar como Hojas de cálculo de Google y usa el nuevo enlace.'
            } else {
                spreadsheetId.value = id
            }

            spreadsheets.value = [
                { id: id, name: 'Identificando Hoja...', lastSync: '-' }
            ]
            generateHook()
        } else {
            spreadsheetId.value = ''
            connectionError.value = 'No se pudo extraer el ID. Asegúrate de que el enlace contiene "/d/..."'
        }
    }

    const generateHook = () => {
        connectionHook.value = `
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById("${spreadsheetId.value}");
    const sheet = ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const result = {
      name: ss.getName(),
      data: data
    };
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    const errorMsg = err.toString();
    const isExcel = errorMsg.includes("Service Spreadsheets failed") || "${spreadsheetId.value}".length < 40;
    const finalMsg = isExcel ? "ERROR: Este es un archivo Excel (.xlsx). Debes convertirlo a Hoja de Google (Archivo > Guardar como Hojas de cálculo de Google)." : errorMsg;
    return ContentService.createTextOutput(JSON.stringify({error: finalMsg}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById("${spreadsheetId.value}");
    const sheet = ss.getSheets()[0];
    sheet.getRange(params.row + 1, params.col + 1).setValue(params.value);
    SpreadsheetApp.flush();
    return ContentService.createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
        `.trim()
    }

    const connectGoogle = async (deployedUrl) => {
        if (!deployedUrl) return

        isSyncing.value = true
        // Ensure whitespace is trimmed
        const cleanUrl = deployedUrl.trim()
        hookUrl.value = cleanUrl
        connectionError.value = ''

        try {
            // CRITICAL VALIDATION: Google Web Apps MUST end in /exec
            if (!cleanUrl.toLowerCase().endsWith('/exec')) {
                throw new Error('URL INCOMPLETA: Tu link debe terminar estrictamente en "/exec". Asegúrate de copiar el enlace de "Gestionar implementaciones".')
            }

            const response = await fetch(hookUrl.value, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit'
            })
            const text = await response.text()

            if (text.trim().toLowerCase().includes('<!doctype html') || text.trim().toLowerCase().includes('<html')) {
                if (text.includes('script-editor') || text.includes('goog-script')) {
                    throw new Error('URL INCORRECTA: Has pegado el link del Editor. Copia el link de "Gestionar implementaciones".')
                }
                if (spreadsheetId.value.length < 40) {
                    throw new Error('ERROR DE ARCHIVO: Google bloqueó el acceso. Esto ocurre porque tu archivo es un Excel (.xlsx). Conviértelo a "Hojas de cálculo de Google" (Archivo > Guardar como...).')
                }
                throw new Error('ERROR DE VÍNCULO: Google devolvió una página de error. Revisa que el ID sea de una Hoja de Cálculo y el script sea público.')
            }

            let result
            try {
                result = JSON.parse(text)
            } catch (e) {
                if (spreadsheetId.value.length < 40) {
                    throw new Error('ERROR DE EXCEL: El script no puede leer archivos .xlsx. Por favor, conviértelo a formato nativo de Google Sheets.')
                }
                throw new Error('La respuesta de Google no es un JSON válido. Revisa los permisos de tu Script (debe ser "Cualquier persona").')
            }

            if (result.error) {
                throw new Error(result.error)
            }

            const sheetName = result.name || 'Hoja de Google'
            const sheetData = result.data || result

            if (Array.isArray(sheetData)) {
                isGoogleConnected.value = true
                connectedEmail.value = 'Google Sheets Real'
                spreadsheets.value = [
                    { id: spreadsheetId.value || '1', name: sheetName, lastSync: 'Ahora mismo' }
                ]
                return true
            } else {
                throw new Error('La respuesta no contiene una matriz de datos válida.')
            }
        } catch (error) {
            console.error('Connection error:', error)

            // Handle generic Browser "Failed to fetch" (CORS / Permissions)
            if (error.message === 'Failed to fetch') {
                connectionError.value = 'ERROR DE VÍNCULO (CORS): Google bloqueó la conexión. Esto suele ocurrir si el Script no está desplegado como "Cualquier persona (Anyone)" o si la URL no es correcta.'
            } else {
                connectionError.value = error.message
            }
            throw error
        } finally {
            isSyncing.value = false
        }
    }

    const disconnectGoogle = () => {
        isGoogleConnected.value = false
        connectedEmail.value = ''
        spreadsheetUrl.value = ''
        spreadsheetId.value = ''
        hookUrl.value = ''
        spreadsheets.value = []
        activeSpreadsheet.value = null
    }

    const fetchSheetData = async (id) => {
        if (!hookUrl.value) return []

        try {
            const response = await fetch(hookUrl.value)
            const result = await response.json()
            return result.data || result
        } catch (error) {
            console.error('Fetch failed:', error)
            return []
        }
    }

    const updateCell = async (id, row, col, value) => {
        if (!hookUrl.value) return

        try {
            // Using POST to update cells. no-cors if needed, but try default first
            await fetch(hookUrl.value, {
                method: 'POST',
                body: JSON.stringify({ row, col, value })
            })
            console.log(`[REAL SYNC] Updated F${row + 1} C${col + 1} = ${value}`)
        } catch (error) {
            console.error('Update failed:', error)
        }
    }

    return {
        isGoogleConnected,
        connectedEmail,
        spreadsheetUrl,
        spreadsheetId,
        connectionHook,
        spreadsheets,
        activeSpreadsheet,
        isSyncing,
        connectionError,
        setSpreadsheetUrl,
        connectGoogle,
        fetchSheetData,
        updateCell,
        disconnectGoogle
    }
})
