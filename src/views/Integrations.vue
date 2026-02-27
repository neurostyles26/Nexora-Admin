<script setup>
import { ref } from 'vue'
import { 
  FileSpreadsheet, 
  BarChartHorizontal, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Database,
  ArrowRight,
  LogOut,
  ChevronRight,
  Link,
  Copy,
  Terminal,
  X
} from 'lucide-vue-next'
import { useIntegrationsStore } from '../stores/integrations'
import SheetEditor from '../components/SheetEditor.vue'

const store = useIntegrationsStore()
const activeTab = ref('google-sheets')
const editingSpreadsheet = ref(null)
const spreadsheetInput = ref('')
const deployedUrlInput = ref('')
const showHookModal = ref(false)
const showDetail = ref(false)
const connectionError = ref('')
const spreadsheetUrlError = ref('')

const openTab = (id) => {
  activeTab.value = id
  showDetail.value = true
  spreadsheetUrlError.value = ''
}

const handleUrlChange = () => {
  if (!spreadsheetInput.value) {
    spreadsheetUrlError.value = 'Por favor, introduce una URL de Google Sheets.'
    return
  }
  store.setSpreadsheetUrl(spreadsheetInput.value)
  if (store.spreadsheetId) {
    showHookModal.value = true
    spreadsheetUrlError.value = ''
  } else {
    spreadsheetUrlError.value = store.connectionError || 'URL de Google Sheets no válida.'
  }
}

const copyHook = () => {
  navigator.clipboard.writeText(store.connectionHook)
}

const connections = ref([
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Sincroniza tus productos y ventas con hojas de cálculo de Google.',
    icon: FileSpreadsheet,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  }
])

const handleConnect = async () => {
  connectionError.value = ''
  try {
    await store.connectGoogle(deployedUrlInput.value)
    showHookModal.value = false
    deployedUrlInput.value = ''
  } catch (err) {
    connectionError.value = err.message
  }
}

const openEditor = (sheet) => {
  editingSpreadsheet.value = sheet
}

const closeEditor = () => {
  editingSpreadsheet.value = null
}
</script>

<template>
  <div class="space-y-8 md:space-y-10 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-4 md:py-8">
      <div class="space-y-3">
        <h1 class="page-title">Integraciones</h1>
        <p class="page-subtitle">Ecosistema Digital Nexora. Conecta tu negocio al mundo.</p>
      </div>
      <div class="flex items-center gap-3 px-4 py-2 bg-indigo-500/5 border border-indigo-500/20 rounded-xl shadow-lg self-start lg:self-auto">
         <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
         <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">ACTIVO</span>
      </div>
    </div>

    <!-- Integration Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Google Sheets Card -->
      <div
        @click="openTab('google-sheets')"
        class="stat-card cursor-pointer group active:scale-[0.98] hover:border-emerald-500/30"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-6">
            <div class="p-4 rounded-2xl bg-emerald-500/10 transition-all group-hover:scale-105 shadow-lg border border-emerald-500/10 shrink-0">
              <FileSpreadsheet class="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
            </div>
            <div v-if="store.isGoogleConnected" class="badge-success">
              <CheckCircle2 class="w-3 h-3" /> VINCULADO
            </div>
          </div>
          <h3 class="text-xl md:text-2xl font-black tracking-tighter italic uppercase mb-2" style="color: var(--text-primary);">Google Sheets</h3>
          <p class="text-sm mb-6 italic leading-relaxed" style="color: var(--text-secondary);">Catálogo en la nube y sincronización de stock.</p>

          <div class="flex items-center gap-2 text-emerald-400 font-bold text-[10px] tracking-[0.3em] group-hover:translate-x-2 transition-transform uppercase">
             ABRIR <ChevronRight class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Power BI Card -->
      <div
        @click="openTab('power-bi')"
        class="stat-card cursor-pointer group active:scale-[0.98] hover:border-yellow-500/30"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-6">
            <div class="p-4 rounded-2xl bg-indigo-500/10 transition-all group-hover:scale-105 shadow-lg border border-indigo-500/10 shrink-0">
              <BarChartHorizontal class="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
            </div>
            <div class="badge-success">
              <CheckCircle2 class="w-3 h-3" /> ACTIVO
            </div>
          </div>
          <h3 class="text-xl md:text-2xl font-black tracking-tighter italic uppercase mb-2" style="color: var(--text-primary);">Power BI</h3>
          <p class="text-sm mb-6 italic leading-relaxed" style="color: var(--text-secondary);">Visualización avanzada e inteligencia predictiva.</p>

          <div class="flex items-center gap-2 text-yellow-500 font-bold text-[10px] tracking-[0.3em] group-hover:translate-x-2 transition-transform uppercase">
             VER INFO <ChevronRight class="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN DETAIL MODAL -->
    <div v-if="showDetail" class="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-[var(--bg-primary)]/98 backdrop-blur-3xl animate-fade-in">
       <div class="max-w-5xl w-full glass-panel border border-[var(--border-primary)] rounded-3xl shadow-3xl overflow-hidden animate-slide-up flex flex-col max-h-[94vh] relative">

          <!-- Modal Header -->
          <div class="p-4 md:p-8 lg:p-10 border-b border-[var(--border-primary)] flex items-center justify-between shrink-0" style="background: linear-gradient(135deg, rgba(99,102,241,0.03), transparent);">
             <div class="flex items-center gap-4 md:gap-6 min-w-0">
                <div :class="['w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg border transition-all shrink-0', activeTab === 'google-sheets' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-yellow-500/10 border-yellow-500/20']">
                   <component :is="activeTab === 'google-sheets' ? FileSpreadsheet : BarChartHorizontal" :class="['w-6 h-6 md:w-8 md:h-8', activeTab === 'google-sheets' ? 'text-emerald-400' : 'text-yellow-400']" />
                </div>
                <div class="space-y-1 min-w-0">
                   <h2 class="text-lg md:text-2xl font-black tracking-tighter italic uppercase truncate" style="color: var(--text-primary);">{{ activeTab === 'google-sheets' ? 'Catálogo Nube' : 'Inteligencia BI' }}</h2>
                   <p class="font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] truncate" style="color: var(--text-muted);">Nexora Integration v2.1</p>
                </div>
             </div>
             <button @click="showDetail = false" class="p-3 md:p-4 rounded-xl transition-all active:scale-95 group shadow-lg shrink-0 hover:bg-rose-500/10" style="background: var(--border-primary);">
                <X class="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform" style="color: var(--text-secondary);" />
             </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 custom-scrollbar space-y-10 md:space-y-14">

             <!-- GOOGLE SHEETS -->
             <div v-if="activeTab === 'google-sheets'" class="space-y-10 animate-fade-in">

               <!-- Connection Status -->
               <div :class="['p-6 md:p-8 rounded-2xl border transition-all relative overflow-hidden', store.isGoogleConnected ? 'border-[var(--border-primary)]' : 'bg-indigo-500/5 border-indigo-500/20']" :style="!store.isGoogleConnected ? '' : 'background: rgba(255,255,255,0.02);'">
                 <div class="relative z-10 flex flex-col gap-6">
                    <h4 class="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em]" style="color: var(--text-muted);">Unidad de Sincronización</h4>
                    
                    <div v-if="store.isGoogleConnected" class="space-y-4">
                       <div class="flex items-center gap-3 flex-wrap">
                          <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg">
                             <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                             <p class="text-sm font-bold text-emerald-400 tracking-wider uppercase italic truncate">{{ store.spreadsheets[0]?.name }}</p>
                          </div>
                       </div>
                       <button @click="store.disconnectGoogle" class="text-[9px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-widest flex items-center gap-2 transition-colors group">
                         <LogOut class="w-3.5 h-3.5" /> DESCONECTAR
                       </button>
                    </div>

                    <div v-else class="space-y-5">
                       <p class="text-sm md:text-base italic leading-relaxed max-w-md" style="color: var(--text-secondary);">No hay un puente de datos vinculado. Inicia la conexión ahora.</p>
                       <div class="flex flex-col gap-3">
                          <div class="relative group w-full">
                             <Link class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" />
                             <input
                               v-model="spreadsheetInput"
                               type="text"
                               placeholder="URL de Google Sheets..."
                               class="border rounded-xl pl-12 pr-4 py-3.5 md:py-4 text-sm focus:outline-none focus:border-indigo-500/40 w-full transition-all"
                               style="background: var(--bg-secondary); border-color: var(--border-primary); color: var(--text-primary);"
                             />
                          </div>
                          <button @click="handleUrlChange" :disabled="!spreadsheetInput" class="btn-primary py-3.5 px-8 text-xs font-bold tracking-[0.15em] shadow-lg active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3 italic uppercase">
                              CONFIGURAR PUENTE
                              <Terminal class="w-4 h-4" />
                           </button>
                       </div>

                       <!-- Error -->
                       <div v-if="spreadsheetUrlError" class="mt-3 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                          <AlertCircle class="w-4 h-4 text-rose-500 shrink-0" />
                          <p class="text-[10px] font-bold text-rose-400 uppercase tracking-wider italic truncate">{{ spreadsheetUrlError }}</p>
                       </div>
                    </div>
                 </div>
               </div>

               <!-- Connected Sheets Grid -->
               <div v-if="store.isGoogleConnected" class="space-y-6 animate-slide-up">
                  <div class="flex items-center justify-between">
                     <h5 class="text-[10px] font-bold uppercase tracking-[0.4em]" style="color: var(--text-muted);">Almacenes Activos</h5>
                     <div class="h-px flex-1 mx-6" style="background: var(--border-primary);"></div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div 
                       v-for="sheet in store.spreadsheets" 
                       :key="sheet.id"
                       class="p-6 md:p-8 rounded-2xl border hover:border-emerald-500/20 transition-all group flex flex-col justify-between shadow-lg hover:-translate-y-1"
                       style="background: var(--bg-secondary); border-color: var(--border-primary);"
                     >
                        <div class="space-y-5">
                           <div class="flex items-start justify-between">
                              <div class="w-14 h-14 rounded-2xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover:bg-emerald-500 transition-all shadow-lg shrink-0">
                                 <FileSpreadsheet class="w-7 h-7 text-emerald-400 group-hover:text-white transition-colors" />
                              </div>
                              <div class="text-right min-w-0 ml-3">
                                 <p class="text-[10px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted);">Sync</p>
                                 <p class="text-xs font-medium italic px-3 py-1 rounded-lg border truncate" style="background: var(--border-secondary); border-color: var(--border-primary); color: var(--text-primary);">{{ sheet.lastSync }}</p>
                              </div>
                           </div>
                           <div class="space-y-1 min-w-0">
                              <h6 class="text-xl font-black tracking-tighter italic uppercase group-hover:text-emerald-400 transition-colors truncate" style="color: var(--text-primary);">{{ sheet.name }}</h6>
                              <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-1.5">
                                 <CheckCircle2 class="w-3.5 h-3.5" /> ACTIVO
                              </p>
                           </div>
                        </div>
                        <button 
                          @click="openEditor(sheet)" 
                          class="mt-6 w-full py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 italic border hover:bg-emerald-500 hover:text-black"
                          style="background: rgba(255,255,255,0.03); border-color: var(--border-primary); color: var(--text-primary);"
                        >
                          Gestionar Catálogo
                        </button>
                     </div>
                  </div>
               </div>

               <!-- Sheet Editor Overlay -->
               <div v-if="editingSpreadsheet" class="fixed inset-0 z-[160] p-4 lg:p-8 bg-[var(--bg-primary)]/99 backdrop-blur-3xl animate-fade-in flex items-center justify-center">
                  <div class="max-w-[98vw] w-full h-[95vh] rounded-3xl overflow-hidden shadow-3xl border border-[var(--border-primary)]">
                    <SheetEditor 
                      :spreadsheetId="editingSpreadsheet.id" 
                      :spreadsheetName="editingSpreadsheet.name"
                      @close="closeEditor"
                    />
                  </div>
               </div>
             </div>

             <!-- POWER BI -->
             <div v-if="activeTab === 'power-bi'" class="space-y-10 animate-fade-in">
               <div class="bg-gradient-to-br from-indigo-500/10 to-yellow-500/5 rounded-3xl p-8 md:p-12 border border-[var(--border-primary)] relative overflow-hidden shadow-xl">
                  
                  <div class="relative z-10 space-y-10">
                     <div class="flex flex-col md:flex-row items-start gap-6 mb-6">
                        <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border shadow-xl shrink-0" style="background: var(--bg-primary); border-color: var(--border-primary);">
                           <Database class="w-8 h-8 md:w-10 md:h-10 text-indigo-400" />
                        </div>
                        <div class="space-y-2 min-w-0">
                           <p class="text-xl md:text-2xl font-black tracking-tighter italic uppercase" style="color: var(--text-primary);">Protocolo DirectQuery</p>
                           <p class="text-sm font-medium italic leading-relaxed" style="color: var(--text-secondary);">Conexión de baja latencia con el núcleo PostgreSQL.</p>
                        </div>
                     </div>

                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="info in [
                          { label: 'Host', value: 'db.czcrcamukofdsyjdkact.supabase.co' },
                          { label: 'Puerto', value: '5432' },
                          { label: 'Base de Datos', value: 'postgres' },
                          { label: 'Usuario', value: 'postgres' }
                        ]" :key="info.label" class="p-6 rounded-2xl border hover:border-indigo-500/20 transition-all group" style="background: var(--bg-secondary); border-color: var(--border-primary);">
                           <p class="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style="color: var(--text-muted);">{{ info.label }}</p>
                           <code class="text-base text-indigo-400 font-mono group-hover:text-[var(--text-primary)] transition-colors italic break-all">{{ info.value }}</code>
                        </div>
                     </div>

                     <div class="flex items-start gap-4 p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                        <AlertCircle class="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                        <div class="space-y-1 min-w-0">
                           <p class="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Credencial Crítica</p>
                           <p class="text-xs font-medium italic leading-relaxed" style="color: var(--text-secondary);">Usa el Secret Key de tu núcleo Supabase. No compartas estas credenciales.</p>
                        </div>
                     </div>

                     <div class="pt-6 flex flex-col lg:flex-row gap-4">
                        <a href="https://powerbi.microsoft.com/es-es/desktop/" target="_blank" class="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 italic">
                           Descargar BI Desktop <ExternalLink class="w-4 h-4" />
                        </a>
                         <div class="flex items-center gap-3 px-6 py-4 border rounded-xl text-[10px] font-bold uppercase tracking-wider italic" style="background: rgba(255,255,255,0.03); border-color: var(--border-primary); color: var(--text-muted);">
                            <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Driver PostgreSQL Verificado
                         </div>
                     </div>
                  </div>
               </div>
             </div>

          </div>
       </div>
    </div>

    <!-- CONNECTION HOOK MODAL -->
    <div v-if="showHookModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-[var(--bg-primary)]/99 backdrop-blur-3xl animate-fade-in overflow-hidden">
       <div class="max-w-4xl w-full glass-panel border border-[var(--border-primary)] rounded-3xl p-6 md:p-10 space-y-8 shadow-3xl max-h-[96vh] overflow-y-auto custom-scrollbar relative">
          <div class="flex items-start justify-between gap-4">
             <div class="space-y-3 min-w-0">
                <div class="flex items-center gap-3 flex-wrap">
                   <span class="px-3 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-[0.3em]">Protocolo Nexora</span>
                   <div class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_var(--accent-glow)]"></div>
                </div>
                <h3 class="text-2xl md:text-3xl font-black tracking-tighter italic uppercase" style="color: var(--text-primary);">Hook de Conexión</h3>
                <p class="text-sm font-medium italic leading-relaxed" style="color: var(--text-secondary);">Instala el puente de datos entre Google y Nexora.</p>
             </div>
              <button @click="showHookModal = false" class="p-3 rounded-xl transition-all group active:scale-95 shadow-lg shrink-0 hover:bg-[var(--border-primary)]" style="background: var(--border-primary);">
                 <X class="w-5 h-5 group-hover:rotate-90 transition-transform" style="color: var(--text-secondary);" />
              </button>
          </div>

          <div class="space-y-8 py-4">
             <!-- Step 1 -->
             <div class="flex flex-col md:flex-row gap-4 md:gap-6 group/step">
                <div class="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-base md:text-lg font-black shrink-0 border group-hover/step:bg-indigo-500 group-hover/step:text-white transition-all" style="background: var(--bg-secondary); border-color: var(--border-primary); color: var(--text-primary);">1</div>
                <div class="space-y-2 pt-1 min-w-0">
                   <p class="text-base md:text-xl font-black italic tracking-tight uppercase" style="color: var(--text-primary);">Activa el motor de Scripts</p>
                   <p class="text-sm font-medium leading-relaxed italic" style="color: var(--text-secondary);">Abre <span style="color: var(--text-primary);" class="font-bold">Extensiones > Apps Script</span> en tu Google Sheet.</p>
                   <div class="flex flex-wrap gap-2 pt-1">
                      <a href="https://script.google.com/home" target="_blank" class="flex items-center gap-2 text-[9px] font-bold text-indigo-400 hover:text-white transition-all uppercase tracking-wider bg-indigo-500/5 px-3 py-2 rounded-lg border border-indigo-500/20">
                        Panel Apps Script <ExternalLink class="w-3 h-3" />
                      </a>
                      <a v-if="store.spreadsheetUrl" :href="store.spreadsheetUrl" target="_blank" class="flex items-center gap-2 text-[9px] font-bold text-emerald-400 hover:text-white transition-all uppercase tracking-wider bg-emerald-500/5 px-3 py-2 rounded-lg border border-emerald-500/20">
                        Abrir Hoja <ExternalLink class="w-3 h-3" />
                      </a>
                   </div>
                </div>
             </div>

             <!-- Step 2 -->
             <div class="flex flex-col md:flex-row gap-4 md:gap-6 group/step w-full">
                <div class="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-base md:text-lg font-black shrink-0 border group-hover/step:bg-indigo-500 group-hover/step:text-white transition-all" style="background: var(--bg-secondary); border-color: var(--border-primary); color: var(--text-primary);">2</div>
                <div class="space-y-4 pt-1 w-full min-w-0">
                   <p class="text-base md:text-xl font-black italic tracking-tight uppercase" style="color: var(--text-primary);">Instala el Nexora Core Hook</p>
                   <div class="p-4 md:p-6 rounded-2xl border relative group/code overflow-hidden" style="background: var(--bg-secondary); border-color: var(--border-primary);">
                      <pre class="text-[10px] md:text-xs text-indigo-400 font-mono overflow-x-auto max-h-[300px] md:max-h-[400px] leading-relaxed custom-scrollbar whitespace-pre">{{ store.connectionHook }}</pre>
                      <button 
                        @click="copyHook" 
                        class="absolute top-3 right-3 md:top-4 md:right-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2"
                      >
                         <Copy class="w-3.5 h-3.5" />
                         <span class="text-[9px] font-bold uppercase tracking-wider">Copiar</span>
                      </button>
                   </div>
                </div>
             </div>

             <!-- Step 3 -->
             <div class="flex flex-col md:flex-row gap-4 md:gap-6 group/step">
                <div class="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-base md:text-lg font-black shrink-0 border group-hover/step:bg-indigo-500 group-hover/step:text-white transition-all" style="background: var(--bg-secondary); border-color: var(--border-primary); color: var(--text-primary);">3</div>
                <div class="space-y-2 pt-1">
                   <p class="text-base md:text-xl font-black italic tracking-tight uppercase" style="color: var(--text-primary);">Despliegue Web</p>
                   <p class="text-sm font-medium leading-relaxed italic" style="color: var(--text-secondary);">
                      Despliega como <span class="text-indigo-400 font-bold italic">Aplicación Web</span> con acceso para <span class="text-emerald-400 font-bold">CUALQUIER PERSONA</span>.
                   </p>
                </div>
             </div>

             <!-- Step 4 -->
             <div class="flex flex-col md:flex-row gap-4 md:gap-6 group/step w-full">
                <div class="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-base md:text-lg font-black shrink-0 border group-hover/step:bg-indigo-500 group-hover/step:text-white transition-all" style="background: var(--bg-secondary); border-color: var(--border-primary); color: var(--text-primary);">4</div>
                <div class="space-y-4 pt-1 w-full min-w-0">
                   <p class="text-base md:text-xl font-black italic tracking-tight uppercase" style="color: var(--text-primary);">Activación Final</p>
                   <div class="relative group">
                      <Terminal class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style="color: var(--text-muted);" />
                      <input 
                        v-model="deployedUrlInput"
                        type="text" 
                        placeholder="Pega la URL final aquí..." 
                        class="border rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500/40 w-full transition-all text-indigo-400 font-mono"
                        style="background: var(--bg-secondary); border-color: var(--border-primary);"
                      />
                   </div>
                   
                   <div v-if="connectionError" class="mt-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2 animate-fade-in">
                      <div class="flex items-center gap-3 text-rose-500 font-bold text-[9px] uppercase tracking-wider italic">
                         <AlertCircle class="w-4 h-4 shrink-0" /> Error de conexión
                      </div>
                      <p class="text-xs font-medium italic leading-relaxed" style="color: var(--text-secondary);">
                         {{ connectionError }}
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex flex-col md:flex-row items-center justify-end gap-4 pt-6 border-t border-[var(--border-primary)] shrink-0">
             <button @click="showHookModal = false" class="text-[10px] font-bold uppercase tracking-widest italic active:scale-95" style="color: var(--text-muted);">
                CANCELAR
             </button>
             <button 
                @click="handleConnect" 
                :disabled="!deployedUrlInput || store.isSyncing"
                class="btn-primary w-full md:w-auto py-4 px-8 text-sm italic font-bold tracking-[0.15em] shadow-lg disabled:opacity-20 flex items-center justify-center gap-3 active:scale-[0.97] transition-all"
             >
                {{ store.isSyncing ? 'CONECTANDO...' : 'VINCULAR' }}
                <ArrowRight v-if="!store.isSyncing" class="w-5 h-5" />
             </button>
          </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slide-up {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
