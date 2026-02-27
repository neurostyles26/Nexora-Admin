<script setup>
import { ref, onMounted, watch } from 'vue'
import { 
  Save, 
  RefreshCw, 
  Search, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit3
} from 'lucide-vue-next'
import { useIntegrationsStore } from '../stores/integrations'

const props = defineProps({
  spreadsheetId: String,
  spreadsheetName: String
})

const emit = defineEmits(['close'])
const store = useIntegrationsStore()

const data = ref([])
const headers = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const editingCell = ref({ row: null, col: null, value: '' })

const loadData = async () => {
  loading.value = true
  // The store now returns dynamic structures based on the spreadsheetId
  const rawData = await store.fetchSheetData(props.spreadsheetId)
  
  // Headers are automatically discovered from the first row
  headers.value = rawData[0]
  
  // Data rows are mapped dynamically regardless of column count
  data.value = rawData.slice(1).map((row, rowIndex) => {
    return row.map((cell, colIndex) => ({
      value: cell,
      originalValue: cell,
      isEditing: false,
      isChanged: false
    }))
  })
  
  loading.value = false
}

const startEdit = (rowIndex, colIndex, value) => {
  editingCell.value = { row: rowIndex, col: colIndex, value: value }
}

const saveEdit = async () => {
  if (editingCell.value.row === null) return
  
  const { row, col, value } = editingCell.value
  
  // Only update if value actually changed
  if (value !== data.value[row][col].value) {
    data.value[row][col].value = value
    data.value[row][col].isChanged = value !== data.value[row][col].originalValue
    
    // Simulation of auto-save to Google Sheets using dynamic coordinates
    saving.value = true
    await store.updateCell(props.spreadsheetId, row, col, value)
    setTimeout(() => { saving.value = false }, 800)
  }
  
  editingCell.value = { row: null, col: null, value: '' }
}

const cancelEdit = () => {
  editingCell.value = { row: null, col: null, value: '' }
}

onMounted(loadData)
</script>

<template>
  <div class="flex flex-col h-full bg-[var(--bg-primary)] rounded-[3rem] border border-[var(--border-primary)] overflow-hidden animate-fade-in shadow-3xl">
    <!-- Editor Header -->
    <div class="p-8 border-b border-[var(--border-primary)] bg-[var(--accent-primary)]/5 flex items-center justify-between transition-all duration-500">
      <div class="flex items-center gap-6">
        <button @click="emit('close')" class="p-3 bg-[var(--border-primary)] hover:bg-white/10 rounded-2xl transition-all active:scale-90 group shadow-lg">
          <ArrowLeft class="w-6 h-6 text-[var(--text-secondary)] group-hover:-translate-x-1 transition-transform" />
        </button>
        <div class="space-y-1">
          <h4 class="text-2xl font-black text-[var(--text-primary)] tracking-tighter italic uppercase underline decoration-indigo-500/20 underline-offset-4">{{ spreadsheetName }}</h4>
          <p class="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] flex items-center gap-2">
            <span class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_var(--accent-glow)]"></span> 
            Matriz Detectada: {{ headers.length }} Atributos / {{ data.length }} Entidades
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div v-if="saving" class="flex items-center gap-3 text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] px-6 py-2 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 shadow-xl animate-pulse">
           <Save class="w-4 h-4" /> Sincronizando Núcleo...
        </div>
        <div class="bg-[var(--border-primary)] h-8 w-px mx-2"></div>
         <button @click="loadData" class="p-3 hover:bg-indigo-500 hover:text-white rounded-2xl transition-all active:rotate-180 group">
            <RefreshCw class="w-5 h-5 text-[var(--text-muted)] group-hover:text-white" />
         </button>
      </div>
    </div>

    <!-- Grid Container -->
    <div class="flex-1 overflow-auto custom-scrollbar relative bg-[var(--bg-primary)]">
      <div v-if="loading" class="absolute inset-0 bg-[var(--bg-primary)]/50 backdrop-blur-md z-30 flex items-center justify-center">
         <div class="flex flex-col items-center gap-6 p-10 glass-panel border border-[var(--border-primary)] rounded-[2.5rem] shadow-3xl">
            <div class="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_20px_var(--accent-glow)]"></div>
            <p class="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] italic anim-float">Extrayendo Datos de Google...</p>
         </div>
      </div>

      <table class="w-full text-left border-collapse min-w-[1000px]">
        <thead class="sticky top-0 z-20 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] shadow-2xl">
          <tr>
            <th class="w-16 px-6 py-6 text-center text-[10px] font-black text-[var(--text-muted)] border-r border-[var(--border-primary)] uppercase tracking-widest bg-[var(--bg-primary)]/50">#</th>
            <th 
              v-for="header in headers" 
              :key="header"
              class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] border-r border-[var(--border-primary)] italic relative group/th"
            >
              <div class="flex items-center justify-between">
                <span>{{ header }}</span>
                <div class="w-1.5 h-1.5 bg-indigo-500/20 rounded-full group-hover/th:bg-indigo-500 transition-colors"></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--border-primary)]">
          <tr v-for="(row, rowIndex) in data" :key="rowIndex" class="group hover:bg-[var(--accent-primary)]/[0.02] transition-colors">
            <td class="px-6 py-6 text-center text-[10px] font-black text-[var(--text-muted)] bg-[var(--bg-primary)]/80 border-r border-[var(--border-primary)] transition-all group-hover:text-indigo-400">
              {{ rowIndex + 1 }}
            </td>
            <td 
              v-for="(cell, colIndex) in row" 
              :key="colIndex"
              class="px-8 py-6 text-sm border-r border-[var(--border-primary)] relative group/cell transition-all min-w-[200px]"
              @dblclick="startEdit(rowIndex, colIndex, cell.value)"
            >
              <!-- Cell Content -->
              <div v-if="editingCell.row !== rowIndex || editingCell.col !== colIndex" class="flex items-center justify-between gap-4">
                <span :class="['font-medium transition-all truncate text-[13px]', cell.isChanged ? 'text-indigo-400 font-black' : 'text-[var(--text-secondary)]']">
                  {{ cell.value || '-' }}
                </span>
                <button 
                  @click="startEdit(rowIndex, colIndex, cell.value)"
                  class="opacity-0 group-hover/cell:opacity-100 p-2 bg-indigo-500/5 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl transition-all active:scale-90"
                >
                  <Edit3 class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Inline Editor -->
              <div v-else class="absolute inset-0 z-40 bg-indigo-500 rounded-lg shadow-[0_10px_30px_-5px_rgba(99,102,241,0.6)] flex items-center px-4 ring-2 ring-indigo-400 ring-offset-2 ring-offset-[var(--bg-primary)] scale-105 transition-transform">
                <input 
                  v-model="editingCell.value"
                  v-focus
                  class="bg-transparent border-none text-white text-sm font-black w-full focus:outline-none italic placeholder:text-white/30"
                  @keyup.enter="saveEdit"
                  @keyup.esc="cancelEdit"
                  @blur="saveEdit"
                  placeholder="Escribe valor..."
                />
              </div>

              <!-- Changed Indicator -->
              <div v-if="cell.isChanged" class="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_var(--accent-glow)]"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Grid Footer -->
    <div class="p-6 md:p-8 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 transition-all duration-500">
      <div class="flex items-center gap-10">
        <div class="space-y-1">
           <p class="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">Registros</p>
           <p class="text-xs font-black text-[var(--text-primary)] italic">{{ data.length }} Entradas</p>
        </div>
        <div class="bg-[var(--border-primary)] h-8 w-px"></div>
        <div class="space-y-1">
           <p class="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">Propiedades</p>
           <p class="text-xs font-black text-[var(--text-primary)] italic">{{ headers.length }} Columnas</p>
        </div>
      </div>
      
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-4 px-6 py-3 bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10 rounded-2xl">
           <span class="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">
              <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_var(--accent-glow)]"></div> 
              Modificados: {{ data.flat().filter(c => c.isChanged).length }}
           </span>
        </div>
        
        <div class="flex items-center gap-3">
          <button class="p-3 bg-[var(--border-primary)] hover:bg-white/10 rounded-xl text-[var(--text-muted)] hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-20"><ChevronLeft class="w-5 h-5" /></button>
          <div class="px-6 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-full text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest shadow-inner">Página 1</div>
          <button class="p-3 bg-[var(--border-primary)] hover:bg-white/10 rounded-xl text-[var(--text-muted)] hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-20"><ChevronRight class="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>

<script>
// Custom directive to focus input
const vFocus = {
  mounted: (el) => el.focus()
}
</script>
