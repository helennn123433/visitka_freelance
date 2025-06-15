import { defineStore } from "pinia"
import { computed, ref } from "vue";
import type { Authentication } from "@/interfaces/authentication/authentication";

export const useAuthStore = defineStore('authStore', () => {
  const openAdmin = ref<boolean>(false);
  
  const user = ref<Authentication | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  const login = (credentials: Authentication) => {
    user.value = credentials
  }

  const logout = () => {
    user.value = null
  }

  return {
    openAdmin,
    user,
    isAuthenticated,
    login,
    logout
  }
})