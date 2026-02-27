import { defineStore } from 'pinia'

export const useBusinessStore = defineStore('business', {
    state: () => ({
        currentBusiness: null,
        businesses: [],
    }),
    actions: {
        setCurrentBusiness(business) {
            this.currentBusiness = business
        },
        setBusinesses(businesses) {
            this.businesses = businesses
        },
    },
})
