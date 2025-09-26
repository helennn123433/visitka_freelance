import { defineStore } from "pinia"
import { computed, ref } from "vue";
import type { Authentication } from "@/interfaces/authentication/authentication";

export const useAuthStore = defineStore('authStore', () => {
  const openAdmin = ref<boolean>(false);
  const user = ref<Authentication | null>(null)
  const token = ref<string | null>(null)

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken) {
      token.value = savedToken
      if (savedUser) {
        user.value = JSON.parse(savedUser)
      }
    }
  }

  const isAuthenticated = computed(() => !!token.value)

  const login = (credentials: Authentication & { token?: string }) => {
    user.value = credentials
    if (credentials.token) {
      token.value = credentials.token
      localStorage.setItem('auth_token', credentials.token)
      localStorage.setItem('auth_user', JSON.stringify(credentials))
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  initializeAuth()

  return {
    openAdmin,
    user,
    isAuthenticated,
    login,
    logout
  }
})