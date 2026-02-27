import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
    const isSidebarCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
    const isMobileMenuOpen = ref(false)

    const toggleSidebar = () => {
        isSidebarCollapsed.value = !isSidebarCollapsed.value
        localStorage.setItem('sidebar-collapsed', isSidebarCollapsed.value)
    }

    const toggleMobileMenu = () => {
        isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const closeMobileMenu = () => {
        isMobileMenuOpen.value = false
    }

    return {
        isSidebarCollapsed,
        isMobileMenuOpen,
        toggleSidebar,
        toggleMobileMenu,
        closeMobileMenu
    }
})
