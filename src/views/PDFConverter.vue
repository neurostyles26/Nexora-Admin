<script setup>
import { ref, computed } from 'vue'
import { 
  FileUp, 
  FileSpreadsheet, 
  FileText, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  FileText as FileDoc
} from 'lucide-vue-next'
import { extractTableFromPDF, downloadAsExcel, downloadAsWord } from '../services/pdfConverter'
import { useIntegrationsStore } from '../stores/integrations'

const integrationsStore = useIntegrationsStore()

const fileInput = ref(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const error = ref('')
const extractedData = ref(null)
const fileName = ref('')

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    processFile(file)
  } else {
    error.value = 'Por favor, selecciona un archivo PDF válido.'
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type === 'application/pdf') {
    processFile(file)
  } else {
    error.value = 'Por favor, suelta un archivo PDF válido.'
  }
}

const processFile = async (file) => {
  isProcessing.value = true
  error.value = ''
  fileName.value = file.name
  
  try {
    const data = await extractTableFromPDF(file)
    extractedData.value = data
  } catch (err) {
    console.error('Error processing PDF:', err)
    error.value = 'Error al procesar el PDF. Asegúrate de que no esté protegido o dañado.'
  } finally {
    isProcessing.value = false
  }
}

const removeFile = () => {
  extractedData.value = null
  fileName.value = ''
  error.value = ''
}

const handleDownload = () => {
  if (extractedData.value) {
    downloadAsExcel(extractedData.value, fileName.value.replace('.pdf', '') + '_convertido.xlsx')
  }
}

const handleDownloadWord = async () => {
  if (extractedData.value) {
    isProcessing.value = true
    try {
      await downloadAsWord(extractedData.value, fileName.value.replace('.pdf', '') + '_convertido.docx')
    } catch (err) {
      error.value = 'Error al generar el documento Word.'
    } finally {
      isProcessing.value = false
    }
  }
}

const handleSync = async () => {
  if (!integrationsStore.isGoogleConnected) {
    error.value = 'Debes conectar Google Sheets primero en la sección de Integraciones.'
    return
  }
  
  // Logic to sync with store/service
  alert('Función de sincronización directa en desarrollo. Por ahora, puedes descargar el Excel.')
}

const triggerFileInput = () => {
  fileInput.value.click()
}
</script>

<template>
  <div class="space-y-8 lg:space-y-12 animate-fade-in pb-20">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-4 md:py-8 border-b border-[var(--border-primary)]">
      <div class="space-y-4 md:space-y-6">
        <div class="flex items-center gap-3">
           <div class="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-lg shrink-0">
              <FileSpreadsheet class="w-5 h-5 text-indigo-400" />
           </div>
           <div class="space-y-0.5 min-w-0">
              <h4 class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 truncate">Nexora Toolset</h4>
              <p class="text-[8px] font-bold uppercase tracking-widest truncate" style="color: var(--text-muted);">Converter Protocol v1.0</p>
           </div>
        </div>
        <div class="space-y-2">
           <h1 class="page-title">Convertidor PDF</h1>
           <p class="page-subtitle">
              Extrae datos estructurados de tus documentos PDF y conviértelos a Excel o Google Sheets con precisión quirúrgica.
           </p>
        </div>
      </div>

      <div class="flex items-center gap-4 px-6 py-4 border rounded-2xl shadow-lg self-start lg:self-auto group hover:border-indigo-500/20 transition-all duration-500 shrink-0" style="background: rgba(255,255,255,0.015); border-color: var(--border-primary);">
         <div class="space-y-1 text-right">
            <p class="text-[9px] md:text-[10px] font-black uppercase tracking-widest" style="color: var(--text-muted);">Estado del Motor</p>
            <p class="text-xs font-bold text-emerald-400">LISTO</p>
         </div>
         <div class="w-px h-10 bg-[var(--border-primary)]"></div>
         <div class="relative">
            <Zap class="w-6 h-6 text-indigo-500/40 animate-pulse" />
         </div>
      </div>
    </div>

    <!-- Main Converter Area -->
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Upload Zone -->
      <div 
        v-if="!extractedData && !isProcessing"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        :class="[
          'glass-panel border-2 border-dashed rounded-3xl p-12 md:p-20 text-center transition-all duration-500 group relative overflow-hidden',
          isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-[var(--border-primary)] hover:border-indigo-500/40'
        ]"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none"></div>
        
        <input 
          type="file" 
          ref="fileInput" 
          class="hidden" 
          accept="application/pdf"
          @change="handleFileSelect"
        />

        <div class="space-y-8 relative z-10">
          <div class="flex justify-center">
            <div class="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <FileUp class="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-2xl font-black italic uppercase tracking-tighter text-white">Cargar Documento PDF</h3>
            <p class="text-sm text-slate-400">Arrastra tu archivo aquí o haz clic para explorar</p>
          </div>

          <button 
            @click="triggerFileInput"
            class="btn-primary py-4 px-10 text-xs font-black italic uppercase tracking-widest inline-flex items-center gap-3 active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            Seleccionar Archivo
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Processing State -->
      <div v-if="isProcessing" class="glass-panel rounded-3xl p-20 text-center space-y-8 border-[var(--border-primary)]">
        <div class="flex justify-center">
          <RefreshCw class="w-16 h-16 text-indigo-400 animate-spin" />
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-black italic uppercase tracking-tighter text-white">Analizando Estructura...</h3>
          <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">IA Extraordinaria en Proceso</p>
        </div>
      </div>

      <!-- Success State -->
      <div v-if="extractedData && !isProcessing" class="animate-slide-up space-y-6">
        <div class="glass-panel rounded-3xl p-8 border border-indigo-500/30 overflow-hidden relative">
          <div class="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full"></div>
          
          <div class="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FileText class="w-8 h-8 text-emerald-400" />
              </div>
              <div class="space-y-1">
                <h3 class="text-lg font-black italic uppercase tracking-tight text-white line-clamp-1">{{ fileName }}</h3>
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
                  <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Extracción Completada</p>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
              <button 
                @click="removeFile"
                class="p-4 rounded-xl border border-[var(--border-primary)] hover:bg-rose-500/10 hover:text-rose-400 transition-all group"
                title="Eliminar archivo"
              >
                <X class="w-5 h-5 text-slate-500 group-hover:rotate-90 transition-transform" />
              </button>
              
              <div class="flex flex-1 md:flex-none gap-3">
                <button 
                  @click="handleDownload"
                  class="flex-1 md:flex-none btn-secondary py-4 px-8 text-[10px] font-black italic uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 shadow-lg border border-indigo-500/20"
                >
                  Excel (.xlsx)
                  <Download class="w-4 h-4" />
                </button>

                <button 
                  @click="handleDownloadWord"
                  class="flex-1 md:flex-none btn-primary py-4 px-8 text-[10px] font-black italic uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  Word (.docx)
                  <FileDoc class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Preview Hint -->
          <div class="mt-8 pt-8 border-t border-indigo-500/10 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Sparkles class="w-4 h-4 text-indigo-400" />
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                 Motor de IA de Nexora listo para la conversión de alta fidelidad.
              </p>
            </div>
            
            <button 
              @click="handleSync"
              class="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
            >
              Sincronizar con Google Sheets
              <ArrowRight class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <!-- Warning / Error State -->
      <div v-if="error" class="animate-shake space-y-4">
        <div class="glass-panel rounded-[2rem] p-8 border border-rose-500/20 bg-rose-500/5 flex items-start gap-6">
          <div class="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
            <AlertCircle class="w-6 h-6 text-rose-400" />
          </div>
          <div class="space-y-2">
            <h4 class="text-sm font-black italic uppercase tracking-widest text-white">Interrupción en el Proceso</h4>
            <p class="text-[11px] text-rose-400 font-bold uppercase tracking-wider leading-relaxed">{{ error }}</p>
          </div>
        </div>
        
        <div class="flex justify-center">
          <button 
             @click="removeFile"
             class="text-[10px] font-black italic uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-400 transition-colors"
          >
             Intentar de nuevo con otro archivo
          </button>
        </div>
      </div>
    </div>

    <!-- Features Matrix -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="feat in [
        { t: 'Detección Inteligente', d: 'Análisis profundo de coordenadas X/Y para preservar la estructura original.' },
        { t: 'Multi-Formato', d: 'Compatible con Excel (.xlsx) y sincronización nativa de Google Sheets.' },
        { t: 'Seguridad Local', d: 'El procesamiento ocurre 100% en tu navegador. Tus datos no salen de Nexora.' }
      ]" :key="feat.t" class="glass-panel p-8 rounded-2xl border border-[var(--border-primary)] space-y-4">
        <h5 class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{{ feat.t }}</h5>
        <p class="text-[11px] text-slate-400 leading-relaxed uppercase">{{ feat.d }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.03);
  color: #a855f7;
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.06);
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
