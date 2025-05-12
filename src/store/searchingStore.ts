import { defineStore } from "pinia";
import { Image } from "@/interfaces/services/Image";
import { ref } from "vue";


export const useSearchingStore = defineStore('searchingStore', () =>{

  const images = ref<Image[]>([])

  const filteredImages = ref<Image[]>([])

  const searchInput = ref<string>("")

  return{
    images,
    filteredImages,
    searchInput
  }
})