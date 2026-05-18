import { create } from 'zustand'

interface AuthStore {
    isLogged: boolean
    login: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    isLogged: false,
    login: () => set({ isLogged: true }),
}))