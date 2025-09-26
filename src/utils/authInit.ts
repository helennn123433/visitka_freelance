// utils/authInit.ts
import { useAuthStore } from '@/store/authStore'

export const initializeApp = async () => {
  const authStore = useAuthStore()
  
  const token = localStorage.getItem('auth_token')
  
  if (token) {
    try {
      // можно добавить проверку валидности токена на бэкенде
    } catch (error) {
      authStore.logout()
    }
  }
}